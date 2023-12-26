import * as React from 'react'
import type { HeadFC, PageProps } from 'gatsby'
import { graphql } from 'gatsby'
import useDarkMode from 'use-dark-mode'
import { nivoGithubFormatter, nivoTwitterFormatter, normalizeGithub } from '../utils/normalize'
import type { IHomepageDataProps } from '../types'
import Line from '../components/line'
import * as styles from '../styles/pages-index.css'
import { atoms } from '../styles/sprinkles.css'
import { linkStyle } from '../styles/global.css'

import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/400-italic.css'
import '@fontsource/ibm-plex-mono/500.css'
import '@fontsource/ibm-plex-mono/500-italic.css'
import '@fontsource/ibm-plex-mono/600.css'
import '@fontsource/ibm-plex-mono/700.css'

const Index: React.FC<PageProps<IHomepageDataProps>> = ({ data: { site, github, twitter } }) => {
  const modes = useDarkMode(false, {
    classNameDark: 'dark',
    classNameLight: 'light',
    storageKey: 'lekoarts-stats-modes',
  })
  const normalizedGithubData = normalizeGithub(github.nodes, 'name')
  const meta = site.siteMetadata

  const githubContent = [
    {
      heading: 'Stars',
      data: nivoGithubFormatter(normalizedGithubData, 'stars'),
    },
    {
      heading: 'Forks',
      data: nivoGithubFormatter(normalizedGithubData, 'forks'),
    },
  ]

  const twitterContent = [
    {
      heading: 'Followers',
      data: nivoTwitterFormatter(twitter.nodes, 'followers'),
    },
    {
      heading: 'Tweets',
      data: nivoTwitterFormatter(twitter.nodes, 'tweets'),
    },
  ]

  return (
    <React.Fragment>
      <header className={styles.header}>
        <h1 className={atoms({ margin: 'none' })}>{meta.title}</h1>
        <div className={atoms({ display: 'flex', alignItems: 'center' })}>
          <button
            className={styles.button}
            onClick={modes.toggle}
            aria-label={modes.value ? 'Activate Light Mode' : 'Activate Dark Mode'}
          >
            {modes.value ? 'Light' : 'Dark'}
          </button>
          <a className={linkStyle} href={meta.repo}>
            GitHub
          </a>
        </div>
      </header>
      <main
        className={atoms({
          paddingY: { mobile: '3x', desktop: '5x' },
          paddingX: { mobile: '4x', desktop: '6x' },
        })}
      >
        <h2 className={atoms({ marginY: 'none' })}>GitHub</h2>
        <section className={styles.content}>
          {githubContent.map(g => (
            <div key={g.heading}>
              <h3 className={atoms({ color: { light: 'gray-700' } })}>{g.heading}</h3>
              <div className={styles.lineContainer}>
                <Line data={g.data} />
              </div>
            </div>
          ))}
        </section>
        <div className={atoms({ paddingY: '6x', paddingX: 'none' })} />
        <h2 className={atoms({ marginY: 'none' })}>Twitter</h2>
        <section className={styles.content}>
          {twitterContent.map(g => (
            <div key={g.heading}>
              <h3 className={atoms({ color: { light: 'gray-700' } })}>{g.heading}</h3>
              <div className={styles.lineContainer}>
                <Line data={g.data} yScaleMin="auto" />
              </div>
            </div>
          ))}
        </section>
      </main>
      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} by{' '}
        <a className={linkStyle} href={meta.homepage}>
          LekoArts
        </a>
        . All rights reserved. <br />
        Follow me on{' '}
        <a className={linkStyle} href={meta.github}>
          GitHub
        </a>{' '}
        or{' '}
        <a className={linkStyle} href={meta.twitter}>
          Twitter
        </a>
        . <br />
        Data is pulled daily. Last build: {site.buildTime}
      </footer>
    </React.Fragment>
  )
}

export default Index

export const Head: HeadFC<IHomepageDataProps> = ({ data: { site: { siteMetadata: meta } } }) => (
  <React.Fragment>
    <title>{meta.title}</title>
    <meta name="description" content={meta.description} />
    <meta name="og:title" content={meta.title} />
    <meta name="og:url" content={meta.url} />
    <meta name="og:description" content={meta.description} />
    <meta name="og:image" content={`${meta.url}${meta.image}`} />
    <meta property="og:type" content="website" />
    <meta property="og:image:alt" content={meta.description} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={meta.title} />
    <meta name="twitter:url" content={meta.url} />
    <meta name="twitter:description" content={meta.description} />
    <meta name="twitter:image" content={`${meta.url}${meta.image}`} />
    <meta name="twitter:image:alt" content={meta.description} />
    <meta name="twitter:creator" content={meta.author} />
    <link
      rel="icon"
      href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>📈</text></svg>"
    />
  </React.Fragment>
)

export const query = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
        url
        repo
        github
        twitter
        homepage
        image
        description
        author
      }
      buildTime(formatString: "YYYY-MM-DD hh:mm a z")
    }
    github: allGithub(sort: { createdAt: ASC }) {
      nodes {
        id
        createdAt(formatString: "YYYY-MM-DD")
        forks
        name
        stars
      }
    }
    twitter: allTwitter(sort: { createdAt: ASC }) {
      nodes {
        id
        tweets
        followers
        createdAt(formatString: "YYYY-MM-DD")
      }
    }
  }
`
