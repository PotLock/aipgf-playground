ALTER TABLE "Provider" ADD COLUMN "apiIdentifier" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "Provider" DROP COLUMN IF EXISTS "apiToken";