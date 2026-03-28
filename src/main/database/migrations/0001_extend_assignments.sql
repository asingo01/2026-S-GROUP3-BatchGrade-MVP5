ALTER TABLE `assignments` ADD COLUMN `grading_criteria` text;
--> statement-breakpoint
ALTER TABLE `assignments` ADD COLUMN `solution_type` text;
--> statement-breakpoint
ALTER TABLE `assignments` ADD COLUMN `solution_file_name` text;
--> statement-breakpoint
ALTER TABLE `assignments` ADD COLUMN `solution_file_path` text;
--> statement-breakpoint
ALTER TABLE `assignments` ADD COLUMN `expected_output_text` text;
--> statement-breakpoint
ALTER TABLE `assignments` ADD COLUMN `created_by_user_uuid` text;
--> statement-breakpoint
ALTER TABLE `assignments` ADD COLUMN `created_at` integer DEFAULT (unixepoch());
