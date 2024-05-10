import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { migrate } from 'drizzle-orm/libsql/migrator'
import { db } from './db'

const __dirname = dirname(fileURLToPath(import.meta.url));

(async () => {
  try {
    await migrate(db, { migrationsFolder: resolve(__dirname, './migrations') })
    // eslint-disable-next-line no-console
    console.log('Migration successful')

    process.exit(0)
  }
  catch (e) {
    console.error(e)

    process.exit(1)
  }
})()
