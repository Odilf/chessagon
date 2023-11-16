CREATE TABLE `draw_offers` (
	`game_id` text PRIMARY KEY NOT NULL,
	`from` integer NOT NULL,
	FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE cascade
);
