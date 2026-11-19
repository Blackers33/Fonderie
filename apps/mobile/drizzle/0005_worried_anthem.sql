PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_performed_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`exercise_order` integer NOT NULL,
	`set_order` integer NOT NULL,
	`reps` integer NOT NULL,
	`weight` real NOT NULL,
	`rest_seconds` integer NOT NULL,
	`completed` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_performed_sets`("id", "workout_id", "exercise_id", "exercise_order", "set_order", "reps", "weight", "completed") SELECT "id", "workout_id", "exercise_id", "exercise_order", "set_order", "reps", "weight", "completed" FROM `performed_sets`;--> statement-breakpoint
DROP TABLE `performed_sets`;--> statement-breakpoint
ALTER TABLE `__new_performed_sets` RENAME TO `performed_sets`;--> statement-breakpoint
PRAGMA foreign_keys=ON;