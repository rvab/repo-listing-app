'use strict';

const { argv } = require("process");
async function listGithubCaches () {
  const { Octokit } = require("@octokit/rest");

  const octokit = new Octokit({
    auth: argv[2],
  })
  
  const result = await octokit.request('GET /repos/rvab/repo-listing-app/actions/caches')
  console.log(result.data)
}
listGithubCaches();