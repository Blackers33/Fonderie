DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `performed_sets` ALTER COLUMN "weight" TO "weight" real NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `performed_sets` ADD `rest_seconds` integer NOT NULL;