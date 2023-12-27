import 'dotenv/config'
import ky from 'ky'
import * as core from '@actions/core'
import { createClient } from '@supabase/supabase-js'
import { createRestAPIClient } from 'masto'

const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql'
const SUPABASE_API_URL = process.env.SUPABASE_API_URL
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const MASTODON_ACCESS_TOKEN = process.env.MASTODON_ACCESS_TOKEN
const MASTODON_ACCOUNT_ID = process.env.MASTODON_ACCOUNT_ID

if (!SUPABASE_API_URL || !SUPABASE_API_KEY || !GITHUB_TOKEN || !MASTODON_ACCESS_TOKEN || !MASTODON_ACCOUNT_ID)
  throw new Error('Missing environment variables')

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
        id: string
      }[]
    }
  }
}

interface GitHubInsert {
  createdAt: string
  forks: number
  name: string
  stars: number
}

interface MastodonInsert {
  createdAt: string
  followersCount: number
  tootsCount: number
}

const supabase = createClient(SUPABASE_API_URL, SUPABASE_API_KEY, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } })

const masto = createRestAPIClient({
  url: 'https://mastodon.social',
  accessToken: MASTODON_ACCESS_TOKEN,
})

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
    core.warning(`[fetchGithubData]: ${err}`)

    return undefined
  }
}

async function fetchMastodonData() {
  try {
    core.info('Fetching Mastodon Data')
    const res = await masto.v2.search.list({
      accountId: MASTODON_ACCOUNT_ID,
      q: 'lekoarts',
      type: 'accounts',
    })
    core.info('Successfully fetched Mastodon Data')

    return {
      followersCount: res.accounts[0].followersCount,
      tootsCount: res.accounts[0].statusesCount,
    }
  }
  catch (err) {
    core.warning(`[fetchMastodonData]: ${err}`)

    return undefined
  }
}

async function run() {
  core.info('Starting with the action...')

  const github = await fetchGithubData()
  const mastodon = await fetchMastodonData()
  const now = new Date().toISOString()

  let GITHUB_INPUT: GitHubInsert[] | undefined
  let MASTODON_INPUT: MastodonInsert | undefined

  if (github) {
    GITHUB_INPUT = github.data.search.nodes.map(repo => ({
      createdAt: now,
      forks: repo.forkCount,
      name: repo.name,
      stars: repo.stargazers.totalCount,
    }))
  }

  if (mastodon) {
    MASTODON_INPUT = {
      createdAt: now,
      followersCount: mastodon.followersCount,
      tootsCount: mastodon.tootsCount,
    }
  }

  if (GITHUB_INPUT) {
    core.info('Pushing GitHub data to supabase')
    const { error: githubInsertError } = await supabase.from('github').insert(GITHUB_INPUT)
    if (githubInsertError)
      core.setFailed(`[githubInsert]: ${githubInsertError}`)
  }

  if (MASTODON_INPUT) {
    core.info('Pushing Mastodon data to supabase')
    const { error: mastodonInsertError } = await supabase.from('mastodon').insert(MASTODON_INPUT)
    if (mastodonInsertError)
      core.setFailed(`[mastodonInsert]: ${mastodonInsertError}`)
  }

  core.info('Done 🎉')
}

run()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function debug() {
  const mastodon = await fetchMastodonData()

  // eslint-disable-next-line no-console
  console.log(mastodon)
}

// debug()
