import type { GatsbyNode } from 'gatsby'
import { createClient } from '@supabase/supabase-js'
import type { IGitHubEntry, ITwitterEntry } from './src/types'

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
      url: String!
      stars: Int!
      forks: Int!
    }
    
    type Twitter implements Node {
      id: ID!
      createdAt: Date! @dateformat
      followers: Int!
      tweets: Int!
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

  const twitterData = twitter.data as ITwitterEntry[]
  const githubData = github.data as IGitHubEntry[]

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
}
