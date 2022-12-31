'use strict';

const listGithubCaches = async () => {
  const { Octokit } = require("@octokit/rest");

  console.log('Deleting GitHub Action cache...', process.env.GITHUB_TOKEN)
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  })
  
  const result = await octokit.request('GET /repos/rvab/repo-listing-app/actions/caches')
  console.log(result.data)
}
listGithubCaches();