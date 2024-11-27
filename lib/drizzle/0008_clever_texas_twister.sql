ALTER TABLE "Agent" ADD COLUMN "tools" json;--> statement-breakpoint
ALTER TABLE "Agent" DROP COLUMN IF EXISTS "tool";