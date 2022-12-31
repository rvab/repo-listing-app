'use strict';

const { argv } = require("process");

const listGithubCaches = async () => {
  const { Octokit } = require("@octokit/rest");

  console.log('Deleting GitHub Action cache...', argv)
  const octokit = new Octokit({
    auth: argv[2],
  })
  
  const result = await octokit.request('GET /repos/rvab/repo-listing-app/actions/caches')
  console.log(result.data)
}
listGithubCaches();