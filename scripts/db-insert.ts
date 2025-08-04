import type { InsertBluesky, InsertGithub, InsertMastodon, InsertTrakt } from '@db/schema'
import * as core from '@actions/core'
import { blueskyTable, githubTable, mastodonTable, traktTable } from '@db/schema'
import { createClient } from '@libsql/client/web'
import { drizzle } from 'drizzle-orm/libsql'
import ky from 'ky'
import { createRestAPIClient } from 'masto'
import 'dotenv/config'

const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql'
const TRAKT_API = 'https://api.trakt.tv'
const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const MASTODON_ACCESS_TOKEN = process.env.MASTODON_ACCESS_TOKEN
const MASTODON_ACCOUNT_ID = process.env.MASTODON_ACCOUNT_ID
const TRAKT_CLIENT_ID = process.env.TRAKT_CLIENT_ID
const TRAKT_USERNAME = process.env.TRAKT_USERNAME
const BLUESKY_HANDLE = process.env.BLUESKY_HANDLE

const IS_SMOKE_TEST = process.env.SMOKE === 'true'

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN || !GITHUB_TOKEN || !MASTODON_ACCESS_TOKEN || !MASTODON_ACCOUNT_ID || !TRAKT_CLIENT_ID || !TRAKT_USERNAME || !BLUESKY_HANDLE)
	throw new Error('Missing environment variables')

const GITHUB_QUERY = `
query {
  search(query: "user:LekoArts topic:lekoarts-oss", type: REPOSITORY, first: 50) {
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
			1: number
			2: number
			3: number
			4: number
			5: number
			6: number
			7: number
			8: number
			9: number
			10: number
		}
	}
}

interface BlueskyResponse {
	did: string
	handle: string
	followersCount: number
	postsCount: number
}

const client = createClient({
	url: TURSO_DATABASE_URL,
	authToken: TURSO_AUTH_TOKEN,
})

const db = drizzle(client)

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

async function fetchBlueskyData() {
	try {
		core.info('Fetching Bluesky Data')
		const res: BlueskyResponse = await ky(`https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${BLUESKY_HANDLE}`).json()
		core.info('Successfully fetched Bluesky Data')

		return {
			followersCount: res.followersCount,
			postsCount: res.postsCount,
		}
	}
	catch (err) {
		core.warning(`[fetchBlueskyData]: ${err}`)

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
	const bluesky = await fetchBlueskyData()
	const now = new Date().toISOString().replace('T', ' ').replace('Z', '+00')

	let GITHUB_INPUT: InsertGithub[] | undefined
	let MASTODON_INPUT: InsertMastodon | undefined
	let TRAKT_INPUT: InsertTrakt | undefined
	let BLUESKY_INPUT: InsertBluesky | undefined

	if (github) {
		GITHUB_INPUT = github.data.search.nodes.map(repo => ({
			createdAt: now,
			forks: repo.forkCount,
			name: repo.name,
			stars: repo.stargazers.totalCount,
		} satisfies InsertGithub))
	}

	if (mastodon) {
		MASTODON_INPUT = {
			createdAt: now,
			followersCount: mastodon.followersCount,
			tootsCount: mastodon.tootsCount,
		} satisfies InsertMastodon
	}

	if (trakt) {
		TRAKT_INPUT = {
			createdAt: now,
			moviesWatched: trakt.moviesWatched,
			showsWatched: trakt.showsWatched,
			episodesWatched: trakt.episodesWatched,
			ratings: trakt.ratings,
		} satisfies InsertTrakt
	}

	if (bluesky) {
		BLUESKY_INPUT = {
			createdAt: now,
			followersCount: bluesky.followersCount,
			postsCount: bluesky.postsCount,
		} satisfies InsertBluesky
	}

	if (IS_SMOKE_TEST) {
		core.info('Running in test mode, skipping data insertion')

		console.log({ GITHUB_INPUT, MASTODON_INPUT, TRAKT_INPUT, BLUESKY_INPUT })

		return
	}

	if (GITHUB_INPUT) {
		core.info('Pushing GitHub data to Turso')
		try {
			await db.insert(githubTable).values(GITHUB_INPUT)
		}
		catch (e) {
			core.setFailed(`[githubInsert]: ${e}`)
		}
	}

	if (MASTODON_INPUT) {
		core.info('Pushing Mastodon data to Turso')
		try {
			await db.insert(mastodonTable).values(MASTODON_INPUT)
		}
		catch (e) {
			core.setFailed(`[mastodonInsert]: ${e}`)
		}
	}

	if (TRAKT_INPUT) {
		core.info('Pushing Trakt data to Turso')
		try {
			await db.insert(traktTable).values(TRAKT_INPUT)
		}
		catch (e) {
			core.setFailed(`[traktInsert]: ${e}`)
		}
	}

	if (BLUESKY_INPUT) {
		core.info('Pushing Bluesky data to Turso')
		try {
			await db.insert(blueskyTable).values(BLUESKY_INPUT)
		}
		catch (e) {
			core.setFailed(`[blueskyInsert]: ${e}`)
		}
	}

	core.info('Done 🎉')
}

run()
