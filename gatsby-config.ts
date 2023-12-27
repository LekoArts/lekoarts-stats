import type { GatsbyConfig } from 'gatsby'
import 'dotenv/config'

const config: GatsbyConfig = {
  siteMetadata: {
    title: 'LekoArts Statistics',
    url: 'https://lekoartsstats.netlify.app/',
    repo: 'https://github.com/LekoArts/lekoarts-stats',
    github: 'https://www.github.com/LekoArts',
    twitter: 'https://www.twitter.com/lekoarts_de',
    mastodon: 'https://mastodon.social/@lekoarts',
    trakt: 'https://trakt.tv/users/arsaurea',
    homepage: 'https://www.lekoarts.de',
    image: '/social.png',
    author: '@lekoarts_de',
    description: 'Dashboard of LekoArts\' GitHub and Twitter statistics over time, visualized with fancy graphs.',
  },
  plugins: ['gatsby-plugin-lodash', 'gatsby-plugin-vanilla-extract'],
}

export default config
