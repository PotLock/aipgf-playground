ALTER TABLE "Provider" ADD COLUMN "apiToken" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "Provider" DROP COLUMN IF EXISTS "endpoint";