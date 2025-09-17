DROP TABLE "channel_members" CASCADE;--> statement-breakpoint
DROP TABLE "channels" CASCADE;--> statement-breakpoint
DROP TABLE "external_events" CASCADE;--> statement-breakpoint
DROP TABLE "messages" CASCADE;--> statement-breakpoint
DROP TABLE "message_translations" CASCADE;--> statement-breakpoint
DROP TABLE "kanban_boards" CASCADE;--> statement-breakpoint
DROP TABLE "kanban_columns" CASCADE;--> statement-breakpoint
DROP TABLE "kanban_tasks" CASCADE;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "preferred_language";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "is_online";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "last_seen";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "updated_at";