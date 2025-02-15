CREATE TABLE IF NOT EXISTS "Provider" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"modelName" varchar(64) NOT NULL,
	"endpoint" varchar(256) NOT NULL,
	"apiToken" varchar(256) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Agent" ADD COLUMN "provider" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Provider" ADD CONSTRAINT "Provider_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Agent" ADD CONSTRAINT "Agent_provider_Provider_id_fk" FOREIGN KEY ("provider") REFERENCES "public"."Provider"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "Agent" DROP COLUMN IF EXISTS "model";