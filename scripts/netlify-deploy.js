'use strict';

const https = require('https');
const { argv } = require('process');
const netlifyBuildHooks = argv[2];
const branchName = argv[3];
const commitAuthor = argv[4];
const commitMessage = argv[5];

console.log({argv})
console.log({netlifyBuildHooks, branchName, commitAuthor, commitMessage})
const parseBuildHooks = JSON.parse(netlifyBuildHooks);
const stagingId = parseBuildHooks.fyle.staging_id


const options = {
  hostname: 'api.netlify.com',
  path: `/build_hooks/''`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const data = {
  trigger_branch: 'master',
  trigger_title: `triggered by ${commitAuthor} with commit message: ${commitMessage}`
};

/**
  * Currently, our netlify plan allows us to deploy only 3 builds concurrently. 
  * Rest of the builds will be queued. Before making a POST API call, verify
  * if staging or hulk build is queued. If yes, then remove it from the queue 
  * and make a new POST API call. This is the worst-case scenario, we can skip
  * this. If this check is not required, then we can execute the curl command in
  * the deploy.yml file. 
  * 1 API to know the if there are any pending deployment.
  * 1 API to cancel the pending deployment.
  */
function deployToNetlify() {
	const req = https.request(options, res => {
	  console.log(`statusCode: ${res.statusCode}`);
	
	  res.on('data', d => {
	    process.stdout.write(d);
	  });
	});
	
	req.on('error', error => {
	  console.error(error);
	});
	
	req.write(JSON.stringify(data));
	req.end();
}

deployToNetlify();