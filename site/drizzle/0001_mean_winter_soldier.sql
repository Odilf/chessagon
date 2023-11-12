ALTER TABLE `moves` RENAME COLUMN `from_x` TO `origin_x`;--> statement-breakpoint
ALTER TABLE `moves` RENAME COLUMN `to_x` TO `target_x`;--> statement-breakpoint
/*
 SQLite does not support "Set not null to column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
ALTER TABLE `moves` DROP COLUMN `from_y`;--> statement-breakpoint
ALTER TABLE `moves` DROP COLUMN `to_y`;