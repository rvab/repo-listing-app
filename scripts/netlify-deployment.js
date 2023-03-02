'use strict';

const https = require('https');
const { argv } = require('process');
const netlifyBuildHooks = argv[2];
const branchName = argv[3];
const commitAuthor = argv[4];
const commitMessage = argv[5];

const parseBuildHooks = JSON.parse(netlifyBuildHooks);
const stagingId = parseBuildHooks.fyle.staging_id

console.log({argv, branchName, commitAuthor, commitMessage, parseBuildHooks, stagingId})

const httpsOptions = {
  hostname: 'api.netlify.com',
  path: `/build_hooks/''`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const postCallData = {
  trigger_branch: 'master',
  trigger_title: `triggered by ${commitAuthor} with commit message: ${commitMessage}`
};

/**
 * 
 * TODO: Currently, our netlify plan allows us to deploy only 3 concurrent builds. Any deployment beyond 3
 * will be queued. Before we trigger the build via POST API call, verify if there is a pending deployment
 * for staging or hulk through an API call. If yes, then remove it from the queue through an API call. 
 * If no, then trigger the build to deploy the changes to staging or hulk.
 * 
 */

function deployToNetlify() {
	const req = https.request(httpsOptions, res => {
	  console.log(`statusCode: ${res.statusCode}`);
	
	  res.on('data', data => {
      console.log('data', data.toString('utf-8'))
      if (res.statusCode !== 200) {
        throw new Error(`Failed to trigger the build with status ${data.toString('utf-8')}`)
      }
	    process.stdout.write(data);
	  });
	});
	
	req.on('error', error => {
	  console.error('error',error);
    throw new Error(`Failed to trigger the build ${JSON.stringify(error)}`)
	});
	
	req.write(JSON.stringify(postCallData));
	req.end();
}

// deployToNetlify();

