ALTER TABLE `user` RENAME TO `users`;--> statement-breakpoint
ALTER TABLE `game` RENAME TO `games`;--> statement-breakpoint
/*
 SQLite does not support "Dropping foreign key" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
DROP INDEX IF EXISTS `game_white_unique`;--> statement-breakpoint
DROP INDEX IF EXISTS `game_black_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `games_white_unique` ON `games` (`white`);--> statement-breakpoint
CREATE UNIQUE INDEX `games_black_unique` ON `games` (`black`);--> statement-breakpoint
/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/