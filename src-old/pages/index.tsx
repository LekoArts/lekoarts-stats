import * as React from 'react'
import type { HeadFC, PageProps } from 'gatsby'
import { graphql } from 'gatsby'
import useDarkMode from 'use-dark-mode'
import { nivoGithubFormatter, nivoMastodonFormatter, nivoTraktFormatter, nivoTwitterFormatter, normalizeGithub } from '../../src/utils/normalize'
import type { IHomepageDataProps } from '../types'
import Line from '../../src/components/line'
import * as styles from '../styles/pages-index.css'
import { atoms } from '../styles/sprinkles.css'
import { linkStyle } from '../styles/global.css'

const Index: React.FC<PageProps<IHomepageDataProps>> = ({ data: { site, github, twitter, mastodon, trakt } }) => {
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

  const socialMediaContent = [
    {
      heading: 'Twitter',
      data: nivoTwitterFormatter(twitter.nodes),
    },
    {
      heading: 'Mastodon',
      data: nivoMastodonFormatter(mastodon.nodes),
    },
  ]

  const traktContent = [
    {
      heading: 'Movies',
      data: nivoTraktFormatter(trakt.nodes, 'moviesWatched'),
    },
    {
      heading: 'Shows',
      data: nivoTraktFormatter(trakt.nodes, 'showsWatched'),
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
        <h2 className={atoms({ marginY: 'none' })}>Social Media</h2>
        <section className={styles.content}>
          {socialMediaContent.map(g => (
            <div key={g.heading}>
              <h3 className={atoms({ color: { light: 'gray-700' } })}>{g.heading}</h3>
              <div className={styles.lineContainer}>
                <Line data={g.data} yScaleMin="auto" />
              </div>
            </div>
          ))}
        </section>
        <div className={atoms({ paddingY: '6x', paddingX: 'none' })} />
        <h2 className={atoms({ marginY: 'none' })}>Trakt</h2>
        <section className={styles.content}>
          {traktContent.map(g => (
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
        </a>{' '}•{' '}
        <a className={linkStyle} href={meta.twitter}>
          Twitter
        </a>{' '}•{' '}
        <a className={linkStyle} href={meta.mastodon}>
          Mastodon
        </a>{' '}•{' '}
        <a className={linkStyle} href={meta.trakt}>
          Trakt
        </a>
        . <br />
        Data is pulled monthly. Last build: {site.buildTime}
      </footer>
    </React.Fragment>
  )
}

export default Index

export const query = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
        url
        repo
        github
        twitter
        mastodon
        trakt
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
    mastodon: allMastodon(sort: { createdAt: ASC }) {
      nodes {
        id
        tootsCount
        followersCount
        createdAt(formatString: "YYYY-MM-DD")
      }
    }
    trakt: allTrakt(sort: { createdAt: ASC }) {
      nodes {
        id
        moviesWatched
        ratings
        showsWatched
        episodesWatched
        createdAt(formatString: "YYYY-MM-DD")
      }
    }
  }
`
