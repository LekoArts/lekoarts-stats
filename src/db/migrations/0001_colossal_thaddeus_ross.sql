CREATE TABLE `bluesky` (
	`id` integer PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`followers_count` integer NOT NULL,
	`posts_count` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `github` ALTER COLUMN "created_at" TO "created_at" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `mastodon` ALTER COLUMN "created_at" TO "created_at" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `trakt` ALTER COLUMN "created_at" TO "created_at" text NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `twitter` ALTER COLUMN "created_at" TO "created_at" text NOT NULL DEFAULT CURRENT_TIMESTAMP;