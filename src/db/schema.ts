import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const githubTable = sqliteTable('github', {
	id: integer('id').primaryKey(),
	createdAt: text('created_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	name: text('name').notNull(),
	forks: integer('forks').notNull(),
	stars: integer('stars').notNull(),
})

export const mastodonTable = sqliteTable('mastodon', {
	id: integer('id').primaryKey(),
	createdAt: text('created_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	followersCount: integer('followers_count').notNull(),
	tootsCount: integer('toots_count').notNull(),
})

export const traktTable = sqliteTable('trakt', {
	id: integer('id').primaryKey(),
	createdAt: text('created_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	moviesWatched: integer('movies_watched').notNull(),
	showsWatched: integer('shows_watched').notNull(),
	episodesWatched: integer('episodes_watched').notNull(),
	ratings: integer('ratings').notNull(),
})

export const twitterTable = sqliteTable('twitter', {
	id: integer('id').primaryKey(),
	createdAt: text('created_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	tweets: integer('tweets').notNull(),
	followers: integer('followers').notNull(),
})

export type InsertGithub = typeof githubTable.$inferInsert
export type SelectGithub = typeof githubTable.$inferSelect

export type InsertMastodon = typeof mastodonTable.$inferInsert
export type SelectMastodon = typeof mastodonTable.$inferSelect

export type InsertTrakt = typeof traktTable.$inferInsert
export type SelectTrakt = typeof traktTable.$inferSelect

export type InsertTwitter = typeof twitterTable.$inferInsert
export type SelectTwitter = typeof twitterTable.$inferSelect
