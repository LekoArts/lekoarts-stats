export interface IGitHubEntry {
  id: string
  createdAt: string
  stars: number
  forks: number
  name: string
}

export interface ITwitterEntry {
  id: string
  tweets: number
  followers: number
  createdAt: string
}

export interface ITraktEntry {
  id: string
  moviesWatched: number
  showsWatched: number
  episodesWatched: number
  ratings: number
  createdAt: string
}

export interface IMastodonEntry {
  id: string
  followersCount: number
  tootsCount: number
  createdAt: string
}

export interface IHomepageDataProps {
  site: {
    siteMetadata: {
      title: string
      url: string
      repo: string
      github: string
      twitter: string
      mastodon: string
      trakt: string
      homepage: string
      image: string
      description: string
      author: string
    }
    buildTime: string
  }
  github: {
    nodes: IGitHubEntry[]
  }
  twitter: {
    nodes: ITwitterEntry[]
  }
  mastodon: {
    nodes: IMastodonEntry[]
  }
  trakt: {
    nodes: ITraktEntry[]
  }
}
