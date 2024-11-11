# LekoArts Statistics

Overview of my stats on GitHub, Bluesky, Mastodon, and Trakt.

Built with Astro, vanilla-extract, Drizzle, and Turso.

## How it works

1. Drizzle is used for setting up the database schema, Turso is used as the "dialect" (it's SQLite)
1. Inside [`scripts/db-insert.ts`](https://github.com/LekoArts/lekoarts-stats/blob/main/scripts/db-insert.ts) the data for each service is fetched from the respective API. Afterwards the data is pushed to Turso.
1. The Astro site consumes the data from Turso and displays it.
