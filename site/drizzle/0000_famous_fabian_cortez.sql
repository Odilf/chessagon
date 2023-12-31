CREATE TABLE `user_key` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`hashed_password` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`active_expires` blob NOT NULL,
	`idle_expires` blob NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`rating` integer DEFAULT 800 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `games` (
	`id` text PRIMARY KEY NOT NULL,
	`started_at` integer NOT NULL,
	`status_code` integer DEFAULT 0 NOT NULL,
	`white` text,
	`black` text,
	`tc_minutes` integer NOT NULL,
	`tc_increment` integer NOT NULL,
	FOREIGN KEY (`white`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`black`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `moves` (
	`index` integer NOT NULL,
	`game_id` text NOT NULL,
	`origin_x` integer NOT NULL,
	`origin_y` integer NOT NULL,
	`target_x` integer NOT NULL,
	`target_y` integer NOT NULL,
	`timestamp` integer NOT NULL,
	PRIMARY KEY(`game_id`, `index`),
	FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE cascade
);
