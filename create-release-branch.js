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

function setReleaseBranchDate(date) {
  const dayOffset = 4; // Friday is the 5th day (0-based index)
  const tzOffset = date.getTimezoneOffset();
  const utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const utcDay = (date.getUTCDay() + 7 - dayOffset) % 7;
  const utcLastFriday = new Date(utcDate - (utcDay * 24 * 60 * 60 * 1000) + (330 * 60 * 1000));

  const istTime = utcLastFriday.toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour12: false });
  console.log('UTC time:', utcLastFriday);
  console.log('IST time:', istTime);


  console.log('utcLastFriday ---' ,{utcLastFriday})

  releaseBranch.fyle = `app_release_${istTime.slice(0, 10).replaceAll('/', '_')}`;
  releaseBranch.flow = `flow_app_release_${istTime.slice(0, 10).replaceAll('/', '_')}`;
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

const createReleaseBranch = (environment, releaseBranch) => {
  let branchExists = false;
  try {
    execSync(`git ls-remote --exit-code --heads origin ${releaseBranch}`);
  } catch (error) {
    branchExists = true;
  }

  if (!branchExists) {
    try {
      execSync(`git checkout -b ${releaseBranch}`);
      execSync(`git push origin ${releaseBranch}`);
      console.log(`Branch ${releaseBranch} created successfully.`);
    } catch (error) {
      console.error('Branch creation failed with error', JSON.stringify(error));
      branchCreationError[environment] = JSON.stringify(error);
    }
  }
};


setReleaseBranchDate(new Date());
createReleaseBranch('fyle', releaseBranch.fyle);
createReleaseBranch('flow', releaseBranch.flow);

postMessageToSlack(branchCreationError);