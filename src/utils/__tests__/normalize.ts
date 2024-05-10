import { formatCreatedAt, nivoGithubFormatter, nivoMastodonFormatter, nivoTraktFormatter, nivoTwitterFormatter, normalizeGithub } from '../normalize'
import { data as githubData } from './__fixtures__/github'
import { data as twitterData } from './__fixtures__/twitter'
import { data as mastodonData } from './__fixtures__/mastodon'
import { data as traktData } from './__fixtures__/trakt'

describe('formatCreatedAt', () => {
  it('should format db date', () => {
    const formatted = formatCreatedAt('2020-07-17 14:02:07.078+00')

    expect(formatted).toBe('2020-07-17')
  })
  it('should format toISOString date', () => {
    const formatted = formatCreatedAt('2024-05-10T16:07:39.210Z')

    expect(formatted).toBe('2024-05-10')
  })
})

describe('normalizeGithub', () => {
  it('should flatten and group data by name', () => {
    const normalized = normalizeGithub(githubData, 'name')
    const namedEntry = normalized['gatsby-starter-minimal-blog']

    expect(normalized).toMatchSnapshot()
    expect(namedEntry).toStrictEqual([
      {
        createdAt: '2020-07-17 14:02:07.078+00',
        forks: 154,
        stars: 517,
        id: 2,
      },
      {
        createdAt: '2020-07-18 14:02:07.078+00',
        forks: 153,
        stars: 517,
        id: 5,
      },
    ])
  })
})

describe('nivoGithubFormatter', () => {
  it('should output correct shape via input', () => {
    const normalized = normalizeGithub(githubData, 'name')
    const nivo = nivoGithubFormatter(normalized, 'stars')

    const objectShape = [
      {
        data: [
          {
            x: '2020-07-17',
            y: 517,
          },
          {
            x: '2020-07-18',
            y: 517,
          },
        ],
        id: 'gatsby-starter-minimal-blog',
      },
    ]

    expect(nivo).toMatchSnapshot()
    expect(nivo).toEqual(expect.arrayContaining(objectShape))
  })
})

describe('nivoTwitterFormatter', () => {
  it('should output correct shape via input', () => {
    const nivo = nivoTwitterFormatter(twitterData)

    const objectShape = [
      {
        data: [
          {
            x: '2020-07-16',
            y: 1126,
          },
          {
            x: '2020-07-17',
            y: 1137,
          },
          {
            x: '2020-07-18',
            y: 1150,
          },
        ],
        id: 'followers',
      },
    ]

    expect(nivo).toMatchSnapshot()
    expect(nivo).toEqual(expect.arrayContaining(objectShape))
  })
})

describe('nivoMastodonFormatter', () => {
  it('should output correct shape via input', () => {
    const nivo = nivoMastodonFormatter(mastodonData)

    const objectShape = [
      {
        data: [
          {
            x: '2020-07-16',
            y: 1126,
          },
          {
            x: '2020-07-17',
            y: 1137,
          },
          {
            x: '2020-07-18',
            y: 1150,
          },
        ],
        id: 'followers',
      },
    ]

    expect(nivo).toMatchSnapshot()
    expect(nivo).toEqual(expect.arrayContaining(objectShape))
  })
})

describe('nivoTraktFormatter', () => {
  it('should output correct shape via input', () => {
    const nivo = nivoTraktFormatter(traktData, 'moviesWatched')

    const objectShape = [
      {
        data: [
          {
            x: '2020-07-16',
            y: 380,
          },
          {
            x: '2020-07-17',
            y: 375,
          },
        ],
        id: 'moviesWatched',
      },
    ]

    expect(nivo).toMatchSnapshot()
    expect(nivo).toEqual(expect.arrayContaining(objectShape))
  })
})
