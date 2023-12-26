import { nivoGithubFormatter, nivoTwitterFormatter, normalizeGithub } from '../normalize'
import { data as githubData } from './__fixtures__/github'
import { data as twitterData } from './__fixtures__/twitter'

describe('normalizeGithub', () => {
  it('should flatten and group data by name', () => {
    const normalized = normalizeGithub(githubData, 'name')
    const namedEntry = normalized['gatsby-starter-minimal-blog']

    expect(normalized).toMatchSnapshot()
    expect(namedEntry).toStrictEqual([
      {
        createdAt: '2020-07-17',
        forks: 154,
        stars: 517,
        id: '2',
      },
      {
        createdAt: '2020-07-18',
        forks: 153,
        stars: 517,
        id: '5',
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
    const nivo = nivoTwitterFormatter(twitterData, 'followers')

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
