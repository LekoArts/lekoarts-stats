import 'isomorphic-unfetch'
import { createClient } from '@urql/core'
import type { GatsbyNode } from 'gatsby'

if (!process.env.AWS_GRAPHQL_API_URL || !process.env.AWS_GRAPHQL_API_TOKEN)
  throw new Error('Missing env vars AWS_GRAPHQL_API_URL or AWS_GRAPHQL_API_TOKEN')

const client = createClient({
  url: process.env.AWS_GRAPHQL_API_URL,
  requestPolicy: 'network-only',
  fetchOptions: () => ({
    headers: {
      'Content-Type': 'application/graphql',
      'x-api-key': process.env.AWS_GRAPHQL_API_TOKEN as string,
    },
  }),
})

const QUERY = `
query {
  listTwitters {
    items {
      id
      datetime
      followers
      tweets
    }
  }
  listGithubs {
    items {
      id
      datetime
      repos {
        id
        name
        url
        stars
        forks
      }
    }
  }
}
`

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = ({ actions }) => {
  const { createTypes } = actions

  createTypes(`
    type Github implements Node {
      id: ID!
      datetime: Date! @dateformat
      repos: [Repo!]!
    }
    
    type Repo {
      id: ID!
      name: String!
      url: String!
      stars: Int!
      forks: Int!
    }
    
    type Twitter implements Node {
      id: ID!
      datetime: Date! @dateformat
      followers: Int!
      tweets: Int!
    }
  `)
}

export const sourceNodes: GatsbyNode['sourceNodes'] = async ({ actions, createNodeId, createContentDigest, reporter }) => {
  const { createNode } = actions

  let data

  try {
    const _rawData = await client.query(QUERY, { id: 'ListTwitterListGitHub' }).toPromise()
    reporter.info('Successfully sourced AWS data')
    data = {
      twitter: _rawData.data.listTwitters.items,
      github: _rawData.data.listGithubs.items,
    }
  }
  catch (error) {
    reporter.panicOnBuild(error)
  }

  data.twitter.forEach((t) => {
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

  data.github.forEach((g) => {
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
