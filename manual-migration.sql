-- Manual migration to add WhatsApp features to production database
-- Run this SQL directly in your Vercel Postgres database

-- Add the missing columns to the receipts table
ALTER TABLE "public"."receipts" 
ADD COLUMN IF NOT EXISTS "add_to_whatsapp" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "public"."receipts" 
ADD COLUMN IF NOT EXISTS "whatsapp_status" TEXT;

-- Create the whatsapp_configs table if it doesn't exist
CREATE TABLE IF NOT EXISTS "public"."whatsapp_configs" (
    "id" SERIAL NOT NULL,
    "group_name" TEXT NOT NULL,
    "group_id" TEXT,
    "invite_link" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "whatsapp_configs_pkey" PRIMARY KEY ("id")
);

-- Verify the columns were added
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'receipts' 
AND column_name IN ('add_to_whatsapp', 'whatsapp_status');
