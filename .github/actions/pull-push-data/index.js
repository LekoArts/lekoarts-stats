require("cross-fetch/polyfill")
const core = require("@actions/core");
const axios = require("axios")
const AWSAppSyncClient = require("aws-appsync").default
const { GITHUB_QUERY, createGithub, createTwitter } = require("./graphql")

const GITHUB_GRAPHQL_API = core.getInput("GITHUB_GRAPHQL_API", { required: true })
const TWITTER_API = core.getInput("TWITTER_API", { required: true })
const AWS_GRAPHQL_API = core.getInput("AWS_GRAPHQL_API", { required: true })
const AWS_TOKEN = core.getInput("AWS_TOKEN", { required: true })
const AWS_REGION = core.getInput("AWS_REGION", { required: true })
const GITHUB_TOKEN = core.getInput("GITHUB_TOKEN", { required: true })

const awsClient = new AWSAppSyncClient({
  url: AWS_GRAPHQL_API,
  region: AWS_REGION,
  auth: {
    type: "API_KEY",
    apiKey: AWS_TOKEN,
  },
  disableOffline: true
})

async function fetchGithubData () {
  try {
    core.info("Fetching GitHub Data")
    const res = await axios({
      url: GITHUB_GRAPHQL_API,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `bearer ${GITHUB_TOKEN}`
      },
      data: {
        query: GITHUB_QUERY,
      }
    })
    core.info("Successfully fetched Github Data")

    return res.data.data.search.nodes
  } catch(err) {
    core.error(`[fetchGithubData]: ${err}`)
  }
}

async function fetchTwitterData () {
  try {
    core.info("Fetching Twitter Data")
    const res = await axios({
      url: TWITTER_API,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
    core.info("Successfully fetched Twitter Data")

    return res.data
  } catch(err) {
    core.error(`[fetchTwitterData]: ${err}`)
  }
}

async function pushAWSGithub (input) {
  try {
    core.info("Pushing Github Data to AWS")

    return await awsClient.mutate({
      mutation: createGithub,
      variables: {
        input,
      }
    })
  } catch(err) {
    core.error(`[pushAWSGithub]: ${err}`)
  }
}

async function pushAWSTwitter (input) {
  try {
    core.info("Pushing Twitter Data to AWS")

    return await awsClient.mutate({
      mutation: createTwitter,
      variables: {
        input,
      }
    })
  } catch(err) {
    core.error(`[pushAWSTwitter]: ${err}`)
  }
}

async function run() {
  const github = await fetchGithubData()
  const twitter = await fetchTwitterData()

  const now = new Date().toISOString()

  const repos = github.map(g => ({
    id: g.id,
    name: g.name,
    url: g.url,
    stars: g.stargazers.totalCount,
    forks: g.forkCount,
  }))

  const GITHUB_INPUT = {
    datetime: now,
    repos,
  }

  const TWITTER_INPUT = {
    datetime: now,
    followers: twitter.followers,
    tweets: twitter.tweets,
  }

  await pushAWSGithub(GITHUB_INPUT)
  await pushAWSTwitter(TWITTER_INPUT)
  core.info("Done 🎉")
}

run()
