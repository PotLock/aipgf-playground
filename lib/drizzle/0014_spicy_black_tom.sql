ALTER TABLE "Agent" DROP CONSTRAINT "Agent_model_Provider_id_fk";
--> statement-breakpoint
ALTER TABLE "Agent" ADD COLUMN "provider" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Agent" ADD CONSTRAINT "Agent_provider_Provider_id_fk" FOREIGN KEY ("provider") REFERENCES "public"."Provider"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "Agent" DROP COLUMN IF EXISTS "model";