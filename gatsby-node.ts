import type { GatsbyNode } from 'gatsby'
import { createClient } from '@supabase/supabase-js'
import type { IGitHubEntry, IMastodonEntry, ITraktEntry, ITwitterEntry } from './src-old/types'

if (!process.env.SUPABASE_API_URL || !process.env.SUPABASE_API_KEY)
  throw new Error('Missing environment variables')

const supabase = createClient(process.env.SUPABASE_API_URL, process.env.SUPABASE_API_KEY, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } })

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = ({ actions }) => {
  const { createTypes } = actions

  createTypes(`
    type Github implements Node {
      id: ID!
      createdAt: Date! @dateformat
      name: String!
      stars: Int!
      forks: Int!
    }
    
    type Twitter implements Node {
      id: ID!
      createdAt: Date! @dateformat
      followers: Int!
      tweets: Int!
    }

    type Trakt implements Node {
      id: ID!
      createdAt: Date! @dateformat
      moviesWatched: Int!
      showsWatched: Int!
      episodesWatched: Int!
      ratings: Int!
    }

    type Mastodon implements Node {
      id: ID!
      createdAt: Date! @dateformat
      followersCount: Int!
      tootsCount: Int!
    }
  `)
}

export const sourceNodes: GatsbyNode['sourceNodes'] = async ({ actions, createNodeId, createContentDigest, reporter }) => {
  const { createNode } = actions

  const twitter = await supabase.from('twitter').select()

  if (twitter.error)
    reporter.panicOnBuild(twitter.error as unknown as Error)

  const github = await supabase.from('github').select()

  if (github.error)
    reporter.panicOnBuild(github.error as unknown as Error)

  const mastodon = await supabase.from('mastodon').select()

  if (mastodon.error)
    reporter.panicOnBuild(mastodon.error as unknown as Error)

  const trakt = await supabase.from('trakt').select()

  if (trakt.error)
    reporter.panicOnBuild(trakt.error as unknown as Error)

  const twitterData = twitter.data as ITwitterEntry[]
  const githubData = github.data as IGitHubEntry[]
  const mastodonData = mastodon.data as IMastodonEntry[]
  const traktData = trakt.data as ITraktEntry[]

  twitterData.forEach((t) => {
    const node = {
      ...t,
      id: createNodeId(`twitter-${t.id}`),
      parent: null,
      children: [],
      internal: {
        type: 'Twitter',
        content: JSON.stringify(t),
        contentDigest: createContentDigest(t),
      },
    }

    createNode(node)
  })

  githubData.forEach((g) => {
    const node = {
      ...g,
      id: createNodeId(`github-${g.id}`),
      parent: null,
      children: [],
      internal: {
        type: 'Github',
        content: JSON.stringify(g),
        contentDigest: createContentDigest(g),
      },
    }

    createNode(node)
  })

  mastodonData.forEach((m) => {
    const node = {
      ...m,
      id: createNodeId(`mastodon-${m.id}`),
      parent: null,
      children: [],
      internal: {
        type: 'Mastodon',
        content: JSON.stringify(m),
        contentDigest: createContentDigest(m),
      },
    }

    createNode(node)
  })

  traktData.forEach((t) => {
    const node = {
      ...t,
      id: createNodeId(`trakt-${t.id}`),
      parent: null,
      children: [],
      internal: {
        type: 'Trakt',
        content: JSON.stringify(t),
        contentDigest: createContentDigest(t),
      },
    }

    createNode(node)
  })
}
