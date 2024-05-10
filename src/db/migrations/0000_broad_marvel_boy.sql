CREATE TABLE `github` (
	`id` integer PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`name` text NOT NULL,
	`forks` integer NOT NULL,
	`stars` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `mastodon` (
	`id` integer PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`followers_count` integer NOT NULL,
	`toots_count` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `trakt` (
	`id` integer PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`movies_watched` integer NOT NULL,
	`shows_watched` integer NOT NULL,
	`episodes_watched` integer NOT NULL,
	`ratings` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `twitter` (
	`id` integer PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`tweets` integer NOT NULL,
	`followers` integer NOT NULL
);
