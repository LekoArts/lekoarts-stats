import 'dotenv/config'
import ky from 'ky-universal'
import * as core from '@actions/core'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_API_URL || !process.env.SUPABASE_API_KEY || !process.env.GITHUB_TOKEN || !process.env.TWITTER_API_URL)
  throw new Error('Missing environment variables')

const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql'
const SUPABASE_API_URL = process.env.SUPABASE_API_URL
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const TWITTER_API_URL = process.env.TWITTER_API_URL

const GITHUB_QUERY = `
query {
  search(query: "user:LekoArts topic:lekoarts-gatsby-themes", type: REPOSITORY, first: 50) {
    nodes {
      ... on Repository {
        stargazers {
          totalCount
        }
        forkCount
        name
        url
        id
      }
    }
  }
}
`

interface GitHubResponse {
  data: {
    search: {
      nodes: {
        stargazers: {
          totalCount: number
        }
        forkCount: number
        name: string
        url: string
        id: string
      }[]
    }
  }
}

interface TwitterResponse {
  username: string
  name: string
  created_at: string
  id: string
  followers_count: number
  following_count: number
  tweet_count: number
  listed_count: number
}

interface GitHubInsert {
  createdAt: string
  forks: number
  name: string
  stars: number
  url: string
}

interface TwitterInsert {
  createdAt: string
  followers: number | undefined
  tweets: number | undefined
}

const supabase = createClient(SUPABASE_API_URL, SUPABASE_API_KEY)

async function fetchGithubData() {
  try {
    core.info('Fetching GitHub Data')
    const res: GitHubResponse = await ky(GITHUB_GRAPHQL_API, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${GITHUB_TOKEN}`,
      },
      json: {
        query: GITHUB_QUERY,
      },
    }).json()
    core.info('Successfully fetched Github Data')

    return res
  }
  catch (err) {
    core.setFailed(`[fetchGithubData]: ${err}`)
  }
}

async function fetchTwitterData() {
  try {
    core.info('Fetching Twitter Data')
    const res: TwitterResponse = await ky(TWITTER_API_URL).json()
    core.info('Successfully fetched Twitter Data')

    return res
  }
  catch (err) {
    core.setFailed(`[fetchTwitterData]: ${err}`)
  }
}

async function run() {
  core.info('Starting with the action...')

  const github = await fetchGithubData()
  const twitter = await fetchTwitterData()
  const now = new Date().toISOString()

  const GITHUB_INPUT: GitHubInsert[] | undefined = github?.data.search.nodes.map(repo => ({
    createdAt: now,
    forks: repo.forkCount,
    name: repo.name,
    stars: repo.stargazers.totalCount,
    url: repo.url,
  }))

  const TWITTER_INPUT: TwitterInsert | undefined = {
    createdAt: now,
    followers: twitter?.followers_count,
    tweets: twitter?.tweet_count,
  }

  core.info('Pushing Twitter data to supabase')
  const { error: twitterInsertError } = await supabase.from('twitter').insert(TWITTER_INPUT)
  if (twitterInsertError)
    core.setFailed(`[twitterInsert]: ${twitterInsertError}`)

  core.info('Pushing GitHub data to supabase')
  const { error: githubInsertError } = await supabase.from('github').insert(GITHUB_INPUT)
  if (githubInsertError)
    core.setFailed(`[githubInsert]: ${githubInsertError}`)

  core.info('Done 🎉')
}

run()
