'use strict';

const { argv } = require('process');
const { execSync } = require('child_process');

const slackDeployWebHookUrl = argv[2];
const releaseBranch = {
  fyle: '',
  flow: ''
};

const branchCreationError = {
  fyle: '',
  flow: ''
};

// function createReleaseBranch(date) {
//   const repoPath = "/path/to/your/repo"; // Replace with your actual repo path
//   const branchName = "new-branch"; // Replace with your desired branch name

//   const commitHash = exec(`git -C ${repoPath} rev-list -1 --before="${utcSixPM.toISOString()}" master`);
//   commitHash.stdout.on("data", function (hash) {
//     const command = `git -C ${repoPath} branch ${branchName} ${hash}`;
//     exec(command, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Failed to create branch ${branchName}: ${error}`);
//       } else {
//         console.log(`Branch ${branchName} created successfully`);
//       }
//     });
//   });
// // This code first calculates the current date and time in UTC, and then adds 6 hours to it to get the cutoff time for commits till 6 PM IST. It then uses the git rev-list command to get the hash of the last commit before this cutoff time on the master branch. Finally, it creates a new branch with the specified name at this commit hash using the git branch command.


// }

const createReleaseBranch = (environment, releaseBranch, date) => {
  let branchExists = false;
  try {
    execSync(`git ls-remote --exit-code --heads origin ${releaseBranch}`);
  } catch (error) {
    branchExists = true;
  }

  if (!branchExists) {
    try {
      const commitHash = execSync(`git rev-list -1 --before="${date.toISOString()}" master`).toString().trim();
      execSync(`git checkout -b ${releaseBranch} ${commitHash}`);
      execSync(`git push origin ${releaseBranch}`);
      console.log(`Branch ${releaseBranch} created successfully.`);
    } catch (error) {
      console.error('Branch creation failed with error', JSON.stringify(error));
      branchCreationError[environment] = JSON.stringify(error);
    }
  }
};

// The below function makes sures that even the script is run manually, then the branch
function setReleaseBranchDate(date) {
  const dayOffset = 5; // Friday is the 5th day (0-based index)
  const utcDay = (date.getDay() + 7 - dayOffset) % 7;
  const utcLastFriday = new Date(date - (utcDay * 24 * 60 * 60 * 1000));
  utcLastFriday.setHours(18, 0, 0)

  createReleaseBranch('fyle', releaseBranch.fyle, utcLastFriday);
  createReleaseBranch('flow', releaseBranch.flow, utcLastFriday);
  const [month, currentDate, year] = utcLastFriday.toLocaleString().slice(0,9).split('/')
  releaseBranch.fyle = `app_release_${year}_${month.length === 1 ? `0${month}`: month}_${currentDate}`;
  releaseBranch.flow = `flow_app_release_${year}_${month.length === 1 ? `0${month}`: month}_${currentDate}`;
}


const getPostCallData = () => {
  const postCallData = {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Web app branch going out in full push on Tuesday\n' +
          "```" +
          `\nFyle app: ${branchCreationError.fyle || releaseBranch.fyle}` +
          `\nFlow app: ${branchCreationError.flow || releaseBranch.flow}` +
          "```" +
          `\n Only the commits till Friday ~6PM are present in the release branch, any commits made on Friday night or during weekends will have to be cherry-picked to this week's release branch IF YOU WANT TO RELEASE IN NEXT FULL PUSH. Thanks cc <!subteam^S03AGEX177V>`
        },
      }
    ]
  };
  return postCallData;
};

const postMessageToSlack = async () => {

  const response = await fetch(slackDeployWebHookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(getPostCallData())
  });

  if (response.status !== 200) {
    throw new Error(`Failed to send the message to slack with error message: ${response.statusText}`);
  }

  console.log(`Message sent successfully ${response.statusText}`);
};


setReleaseBranchDate(new Date());

// postMessageToSlack(branchCreationError);