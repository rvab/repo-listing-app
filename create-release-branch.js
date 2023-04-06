'use strict';

const { argv } = require('process');
const { execSync } = require('child_process');

const slackDeployWebHookUrl = argv[2];

/*
 * if (!slackDeployWebHookUrl) {
 *   throw new Error('Slack deploy webhook url is not provided');
 * }
 */

const getPostCallData = (releaseBranch, branchCreationError) => {
  const text = `Web app branch going out in full push on Tuesday\n` +
  `\`\`\`` +
  `\napp: ${branchCreationError || releaseBranch}` +
  `\`\`\`${
    branchCreationError
      ? '\n cc <!subteam^S03AGEX177V>'
      : '\n Only the commits till Friday 6PM are present in the release branch, any commits made on Friday night or during weekends will have to be cherry-picked to this week\'s release branch IF YOU WANT TO RELEASE IN NEXT FULL PUSH. Thanks cc <!subteam^S03AGEX177V>'}`;

  const postCallData = {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: text
        },
      }
    ]
  };

  return postCallData;
};

const postMessageToSlack = (releaseBranch, branchCreationError) => {
  fetch(slackDeployWebHookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(getPostCallData(releaseBranch, branchCreationError))
  })
    .then(response => {
      if (response.status !== 200) {
        throw new Error(`Failed to send the message to slack with error message: ${response.statusText}`);
      }
      console.log(`Message sent successfully ${response.statusText}`);
    })
    .catch(error => console.error('Error sending message to Slack:', error));
};

const createReleaseBranch = (releaseBranch, date) => {
  try {
    // Verify if the branch name exists in the origin
    const result = execSync(`git ls-remote --heads origin releaseBranch`).toString();
    console.log({result})
  } catch (error) {
    console.error('Failed to verify the branch name exists in the origin', error.toString());
    return error.toString();
  }

  try {
    /**
     * Get the commit hash of the last commit that was merged before the date passed as an argument.
     * @link https://git-scm.com/docs/git-rev-list#Documentation/git-rev-list.txt---beforeltdategt
     */
    const commitHash = execSync(`git rev-list -1 --before="${date.toISOString()}" master`).toString().trim();
    execSync(`git checkout -b ${releaseBranch} ${commitHash}`);
    execSync(`git push origin ${releaseBranch}`);
    console.log(`Branch ${releaseBranch} created successfully.`);
    return '';
  } catch (error) {
    const errorMessage = error.toString();
    if (!errorMessage.includes(`branch named ${releaseBranch} already exists`)) {
      console.error('Failed to create the release branch', errorMessage);
      return errorMessage;
    }
    return '';
  }
};


/**
 * In case the job fails due to an unknown reason, running the script manually should create the release branch
 * for web app with the commits that are merged till the previous Friday at 6PM.
 */
function createAndNotifyReleaseBranch(date) {

  const utcLastFriday = new Date(date);
  utcLastFriday.setDate(date.getDate() - ((date.getDay() || 7) + 2) % 7);
  utcLastFriday.setHours(18, 0, 0);

  const [month, currentDate, year] = utcLastFriday.toLocaleString().slice(0, 9).split('/');
  const releaseBranch = `app_release_${year}_${month.padStart(2, '0')}_${currentDate}`;

  const branchCreationError = createReleaseBranch(releaseBranch, utcLastFriday);

  postMessageToSlack(releaseBranch, branchCreationError);
}

createAndNotifyReleaseBranch(new Date());