import React from 'react'
import { graphql } from 'gatsby'
import { css } from 'linaria'
import { LineChart, XAxis, YAxis, Line, CartesianGrid, Tooltip, Label, Legend } from 'recharts'
import 'typeface-ibm-plex-mono'
import { globals } from '../styles/globals'

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

const colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF']

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
        <LineChart width={1200} height={400} data={stars}>
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
            <Line dataKey={r.fieldValue} type="monotone" stroke={colorArray[index]} />
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
