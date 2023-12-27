import _ from 'lodash'
import type { IGitHubEntry, IMastodonEntry, ITraktEntry, ITwitterEntry } from '../types'

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

export function nivoTwitterFormatter(data: ITwitterEntry[]) {
  const followersValues = data.map(e => ({
    x: e.createdAt,
    y: e.followers,
  }))
  const tweetsValues = data.map(e => ({
    x: e.createdAt,
    y: e.tweets,
  }))

  return [
    {
      id: 'followers',
      data: followersValues,
    },
    {
      id: 'tweets',
      data: tweetsValues,
    },
  ]
}

export function nivoMastodonFormatter(data: IMastodonEntry[]) {
  const followersValues = data.map(e => ({
    x: e.createdAt,
    y: e.followersCount,
  }))
  const tweetsValues = data.map(e => ({
    x: e.createdAt,
    y: e.tootsCount,
  }))

  return [
    {
      id: 'followers',
      data: followersValues,
    },
    {
      id: 'toots',
      data: tweetsValues,
    },
  ]
}

export function nivoTraktFormatter(data: ITraktEntry[], name: keyof ITraktEntry) {
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
