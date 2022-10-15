import _ from 'lodash'

/**
 * _.mapValues: https://lodash.com/docs/4.17.15#mapValues
 * _.groupBy: https://lodash.com/docs/4.17.15#groupBy
 * _.omit: https://lodash.com/docs/4.17.15#omit
 */

export function constructShape(data, name, omit) {
  return _.mapValues(_.groupBy(data, name), list => list.map(entry => _.omit(entry, omit)))
}

export function normalizeGithub(data, name, omit) {
  return constructShape(data, name, omit)
}

export function nivoGithubFormatter(data, name) {
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

export function nivoTwitterFormatter(data, name) {
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
