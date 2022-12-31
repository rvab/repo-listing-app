'use strict';

const { argv } = require("process");
async function listGithubCaches () {
  const { Octokit } = require("@octokit/rest");

  const octokit = new Octokit({
    auth: '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',
  })
  
  const result = await octokit.request('GET /repos/rvab/repo-listing-app/actions/caches')
  console.log(result.data)
}
listGithubCaches();