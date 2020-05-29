import React from 'react'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import 'typeface-ibm-plex-mono'
import '../styles/globals.css'
import { nivoGithubFormatter, nivoTwitterFormatter, normalizeGithub } from '../utils/normalize'
import Line from '../components/line'
import { styles } from '../styles/page-index'

const Index = ({ data }) => {
  const normalizedGithubData = normalizeGithub(data.github.nodes, 'name', 'name')
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
      data: nivoTwitterFormatter(data.twitter.nodes, 'followers'),
    },
    {
      heading: 'Tweets',
      data: nivoTwitterFormatter(data.twitter.nodes, 'tweets'),
    },
  ]

  return (
    <React.Fragment>
      <Helmet>
        <html lang="en" />
        <title>{data.site.siteMetadata.title}</title>
      </Helmet>
      <header className={styles.header}>
        <h1>{data.site.siteMetadata.title}</h1>
        <a href="https://github.com/LekoArts/lekoarts-stats">GitHub</a>
      </header>
      <main className={styles.main}>
        <h2 style={{ marginBottom: 0, marginTop: 0 }}>GitHub</h2>
        <div className={styles.content}>
          {githubContent.map((g) => (
            <div key={g.heading}>
              <h3>{g.heading}</h3>
              <div className={styles.lineContainer}>
                <Line data={g.data} xAxisName="Date" yAxisName={g.heading} />
              </div>
            </div>
          ))}
        </div>
        <div className={styles.spacer} />
        <h2 style={{ marginBottom: 0 }}>Twitter</h2>
        <div className={styles.content}>
          {twitterContent.map((g) => (
            <div key={g.heading}>
              <h3>{g.heading}</h3>
              <div className={styles.lineContainer}>
                <Line data={g.data} yScaleMin="auto" xAxisName="Date" yAxisName={g.heading} />
              </div>
            </div>
          ))}
        </div>
      </main>
      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} by <a href="https://www.lekoarts.de">LekoArts</a>. All rights reserved. <br />
        Follow me on <a href="https://www.github.com/LekoArts">GitHub</a> or{' '}
        <a href="https://www.twitter.com/lekoarts_de">Twitter</a>. <br />
        Data is pulled daily. Last build: {data.site.buildTime}
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
