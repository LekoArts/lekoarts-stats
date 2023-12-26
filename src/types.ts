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

export interface IHomepageDataProps {
  site: {
    siteMetadata: {
      title: string
      url: string
      repo: string
      github: string
      twitter: string
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
}
