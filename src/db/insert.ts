import { db } from './db'
import { type InsertGithub, githubTable } from './schema'

const dataRaw = []

const data: InsertGithub[] = dataRaw.map((entry) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = entry

  return {
    ...rest,
  }
})

const insertTrakt = async (entries: InsertGithub[]) => {
  return db.insert(githubTable).values(entries)
}

await insertTrakt(data)
