import 'dotenv/config'
import ky from 'ky'
import * as core from '@actions/core'
import { createClient } from '@supabase/supabase-js'
import { createRestAPIClient } from 'masto'

const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql'
const TRAKT_API = 'https://api.trakt.tv'
const SUPABASE_API_URL = process.env.SUPABASE_API_URL
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const MASTODON_ACCESS_TOKEN = process.env.MASTODON_ACCESS_TOKEN
const MASTODON_ACCOUNT_ID = process.env.MASTODON_ACCOUNT_ID
const TRAKT_CLIENT_ID = process.env.TRAKT_CLIENT_ID
const TRAKT_USERNAME = process.env.TRAKT_USERNAME

if (!SUPABASE_API_URL || !SUPABASE_API_KEY || !GITHUB_TOKEN || !MASTODON_ACCESS_TOKEN || !MASTODON_ACCOUNT_ID || !TRAKT_CLIENT_ID || !TRAKT_USERNAME)
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

interface TraktResponse {
  movies: {
    plays: number
    watched: number
    minutes: number
    collected: number
    ratings: number
    comments: number
  }
  shows: {
    watched: number
    collected: number
    ratings: number
    comments: number
  }
  seasons: {
    ratings: number
    comments: number
  }
  episodes: {
    plays: number
    watched: number
    minutes: number
    collected: number
    ratings: number
    comments: number
  }
  network: {
    friends: number
    followers: number
    following: number
  }
  ratings: {
    total: number
    distribution: {
      '1': number
      '2': number
      '3': number
      '4': number
      '5': number
      '6': number
      '7': number
      '8': number
      '9': number
      '10': number
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

interface TraktInsert {
  createdAt: string
  moviesWatched: number
  showsWatched: number
  episodesWatched: number
  ratings: number
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

async function fetchTraktData() {
  try {
    core.info('Fetching Trakt Data')
    const res: TraktResponse = await ky(`${TRAKT_API}/users/${TRAKT_USERNAME}/stats`, {
      method: 'GET',
      headers: {
        'user-agent': 'trakt-yearly-posters',
        'Content-type': 'application/json',
        'trakt-api-key': TRAKT_CLIENT_ID,
        'trakt-api-version': '2',
      },
    }).json()
    core.info('Successfully fetched Trakt Data')

    return {
      moviesWatched: res.movies.watched,
      showsWatched: res.shows.watched,
      episodesWatched: res.episodes.watched,
      ratings: res.ratings.total,
    }
  }
  catch (err) {
    core.warning(`[fetchTraktData]: ${err}`)

    return undefined
  }
}

async function run() {
  core.info('Starting with the action...')

  const github = await fetchGithubData()
  const mastodon = await fetchMastodonData()
  const trakt = await fetchTraktData()
  const now = new Date().toISOString()

  let GITHUB_INPUT: GitHubInsert[] | undefined
  let MASTODON_INPUT: MastodonInsert | undefined
  let TRAKT_INPUT: TraktInsert | undefined

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

  if (trakt) {
    TRAKT_INPUT = {
      createdAt: now,
      moviesWatched: trakt.moviesWatched,
      showsWatched: trakt.showsWatched,
      episodesWatched: trakt.episodesWatched,
      ratings: trakt.ratings,
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

  if (TRAKT_INPUT) {
    core.info('Pushing Trakt data to supabase')
    const { error: traktInsertError } = await supabase.from('trakt').insert(TRAKT_INPUT)
    if (traktInsertError)
      core.setFailed(`[traktInsert]: ${traktInsertError}`)
  }

  core.info('Done 🎉')
}

run()
