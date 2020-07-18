import React from 'react'
import { graphql } from 'gatsby'
import 'typeface-ibm-plex-mono'

import '../styles/globals.css'
import { nivoGithubFormatter, nivoTwitterFormatter, normalizeGithub } from '../utils/normalize'
import Line from '../components/line'
import { styles } from '../styles/page-index'
import SEO from '../components/seo'

const Index = ({ data: { site, github, twitter } }) => {
  const normalizedGithubData = normalizeGithub(github.nodes, 'name', 'name')
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
      <SEO meta={meta} />
      <header className={styles.header}>
        <h1>{site.siteMetadata.title}</h1>
        <a href={meta.repo}>GitHub</a>
      </header>
      <main className={styles.main}>
        <h2 style={{ marginBottom: 0, marginTop: 0 }}>GitHub</h2>
        <section className={styles.content}>
          {githubContent.map((g) => (
            <div key={g.heading}>
              <h3>{g.heading}</h3>
              <div className={styles.lineContainer}>
                <Line data={g.data} xAxisName="Date" yAxisName={g.heading} />
              </div>
            </div>
          ))}
        </section>
        <div className={styles.spacer} />
        <h2 style={{ marginBottom: 0 }}>Twitter</h2>
        <section className={styles.content}>
          {twitterContent.map((g) => (
            <div key={g.heading}>
              <h3>{g.heading}</h3>
              <div className={styles.lineContainer}>
                <Line data={g.data} yScaleMin="auto" xAxisName="Date" yAxisName={g.heading} />
              </div>
            </div>
          ))}
        </section>
      </main>
      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} by <a href={meta.homepage}>LekoArts</a>. All rights reserved. <br />
        Follow me on <a href={meta.github}>GitHub</a> or <a href={meta.twitter}>Twitter</a>. <br />
        Data is pulled daily. Last build: {site.buildTime}
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
        homepage
        image
        description
        author
      }
      buildTime(formatString: "YYYY-MM-DD hh:mm a z")
    }
    github: allGithub(sort: { fields: datetime, order: ASC }) {
      nodes {
        id
        datetime(formatString: "YYYY-MM-DD")
        repos {
          forks
          id
          name
          stars
          url
        }
      }
    }
    twitter: allTwitter(sort: { fields: datetime, order: ASC }) {
      nodes {
        tweets
        followers
        datetime(formatString: "YYYY-MM-DD")
      }
    }
  }
`
