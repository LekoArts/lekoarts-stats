import 'dotenv/config'
import type { Config } from 'drizzle-kit'

export default {
	schema: './src/db/schema.ts',
	out: './src/db/migrations',
	driver: 'turso',
	dialect: 'sqlite',
	dbCredentials: {
		url: process.env.TURSO_DATABASE_URL!,
		authToken: process.env.TURSO_AUTH_TOKEN!,
	},
	verbose: true,
	strict: true,
} satisfies Config
