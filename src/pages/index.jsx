import React from 'react'
import { graphql } from 'gatsby'
import { css } from 'linaria'
import { LineChart, XAxis, YAxis, Line, CartesianGrid, Tooltip, Label, Legend } from 'recharts'
import { strokeColors } from '../styles/colors'
import Dot from '../components/dot'
import { globals } from '../styles/globals'
import 'typeface-ibm-plex-mono'

const header = css`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--color-gray-100);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  h1 {
    font-size: 1.25rem;
  }
`

const footer = css`
  padding: 1.5rem 2rem;
  font-size: 0.9rem;
  color: var(--color-gray-600);
  border-top: 1px solid var(--color-gray-100);
`

const strokeDasharray = ["2 4", "4 8", "1 2", "10 5", "8 3", "15 8", "30 10", "0"]

const Index = ({ data }) => {
  const stars = data.github.nodes.flatMap(g => {
    const repos = g.repos.map(r => {
      return ({
        [r.name]: r.stars
      })
    })

    return Object.assign({}, { date: g.datetime }, ...repos)
  })

  return (
    <React.Fragment>
      <header className={header}>
        <h1>{data.site.siteMetadata.title}</h1>
        <a href="https://github.com/LekoArts/lekoarts-stats">GitHub</a>
      </header>
      <main>
        <LineChart width={1200} height={500} data={stars}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date">
            <Label value="Time" offset={0} position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label value="Stars" angle={-90} offset={0} position="insideLeft" />
          </YAxis>
          <Legend />
          <Tooltip />
          {data.repos.group.map((r, index) => (
            <Line dataKey={r.fieldValue} type="linear" strokeWidth={2} stroke={strokeColors[index]} strokeDasharray={strokeDasharray[index]} dot={<Dot color={strokeColors[index]} />} activeDot={<Dot color={strokeColors[index]} active />} />
          ))}
        </LineChart>
      </main>
      <footer className={footer}>
        &copy; {new Date().getFullYear()} by <a href="https://www.lekoarts.de">LekoArts</a>. All rights reserved. <br />
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
    github: allGithub(sort: {fields: datetime, order: ASC}) {
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
    repos: allGithub {
      group(field: repos___name) {
        fieldValue
      }
    }
    twitter: allTwitter(sort: {fields: datetime, order: ASC}) {
      nodes {
        tweets
        followers
        datetime(formatString: "YYYY-MM-DD")
      }
    }
  }
`
