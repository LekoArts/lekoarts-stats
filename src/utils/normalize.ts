import _ from 'lodash'
import type { IGitHubEntry, ITwitterEntry } from '../types'

/**
 * _.mapValues: https://lodash.com/docs/4.17.15#mapValues
 * _.groupBy: https://lodash.com/docs/4.17.15#groupBy
 * _.omit: https://lodash.com/docs/4.17.15#omit
 */

export function normalizeGithub(data: IGitHubEntry[], name: keyof IGitHubEntry) {
  return _.mapValues(_.groupBy(data, name), list => list.map(entry => _.omit(entry, name))) as GitHubFormatterDataInput
}

interface GitHubFormatterDataInput {
  [key: string]: Omit<IGitHubEntry, 'name'>[]
}

export function nivoGithubFormatter(data: GitHubFormatterDataInput, name: keyof Omit<IGitHubEntry, 'name'>) {
  const keys = Object.keys(data)
  const nivoData = []

  for (const key of keys) {
    const entry = data[key]

    const values = entry.map(e => ({
      x: e.createdAt,
      y: e[name],
    }))

    const obj = {
      id: key,
      data: values,
    }

    nivoData.push(obj)
  }

  return nivoData.reverse()
}

export function nivoTwitterFormatter(data: ITwitterEntry[], name: keyof ITwitterEntry) {
  const values = data.map(e => ({
    x: e.createdAt,
    y: e[name],
  }))

  return [
    {
      id: name,
      data: values,
    },
  ]
}
