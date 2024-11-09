ALTER TABLE "Agent" ADD COLUMN "model" varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE "Agent" DROP COLUMN IF EXISTS "suggestedActions";