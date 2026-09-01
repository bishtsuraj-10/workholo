ALTER TABLE "dialer_campaign" ADD COLUMN "lead_list_id" text;
--> statement-breakpoint
ALTER TABLE "dialer_campaign" ADD CONSTRAINT "dialer_campaign_lead_list_id_lead_list_id_fk" FOREIGN KEY ("lead_list_id") REFERENCES "public"."lead_list"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE TABLE "lead" (
	"address" text DEFAULT '' NOT NULL,
	"alternate_phone_number" text DEFAULT '' NOT NULL,
	"call_count" integer DEFAULT 0 NOT NULL,
	"company_name" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"disposition_list" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"lead_list_id" text NOT NULL,
	"lead_status" text DEFAULT 'New' NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"phone_number" text DEFAULT '' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lead" ADD CONSTRAINT "lead_lead_list_id_lead_list_id_fk" FOREIGN KEY ("lead_list_id") REFERENCES "public"."lead_list"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "lead_lead_list_id_idx" ON "lead" USING btree ("lead_list_id");
