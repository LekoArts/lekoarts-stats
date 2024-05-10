import { createClient } from '@libsql/client/web'
import { drizzle } from 'drizzle-orm/libsql'

const client = createClient({
	url: import.meta.env.TURSO_DATABASE_URL,
	authToken: import.meta.env.TURSO_AUTH_TOKEN,
})

export const db = drizzle(client)
