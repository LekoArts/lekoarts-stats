import { groupBy, mapValues, omit } from 'lodash-es'

/**
 * _.mapValues: https://lodash.com/docs/4.17.15#mapValues
 * _.groupBy: https://lodash.com/docs/4.17.15#groupBy
 * _.omit: https://lodash.com/docs/4.17.15#omit
 */

/**
 * Formats 2020-07-18 14:02:07.078+00 to 2020-07-18
 * Format 2024-05-10T16:07:39.210Z to 2024-05-10
 */
export function formatCreatedAt(date: string) {
  return date.split('T')[0].split(' ')[0]
}

interface IGitHubEntry {
  id: number
  name: string
  createdAt: string
  forks: number
  stars: number
}

export function normalizeGithub(data: IGitHubEntry[], name: keyof IGitHubEntry) {
  return mapValues(groupBy(data, name), list => list.map(entry => omit(entry, name))) as GitHubFormatterDataInput
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
      x: formatCreatedAt(e.createdAt),
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

interface ITwitterEntry {
  id: number
  createdAt: string
  tweets: number
  followers: number
}

export function nivoTwitterFormatter(data: ITwitterEntry[]) {
  const followersValues = data.map(e => ({
    x: formatCreatedAt(e.createdAt),
    y: e.followers,
  }))
  const tweetsValues = data.map(e => ({
    x: formatCreatedAt(e.createdAt),
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

interface IMastodonEntry {
  id: number
  createdAt: string
  followersCount: number
  tootsCount: number
}

export function nivoMastodonFormatter(data: IMastodonEntry[]) {
  const followersValues = data.map(e => ({
    x: formatCreatedAt(e.createdAt),
    y: e.followersCount,
  }))
  const tweetsValues = data.map(e => ({
    x: formatCreatedAt(e.createdAt),
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

interface ITraktEntry {
  id: number
  createdAt: string
  moviesWatched: number
  showsWatched: number
  episodesWatched: number
  ratings: number
}

export function nivoTraktFormatter(data: ITraktEntry[], name: keyof ITraktEntry) {
  const values = data.map(e => ({
    x: formatCreatedAt(e.createdAt),
    y: e[name],
  }))

  return [
    {
      id: name,
      data: values,
    },
  ]
}
