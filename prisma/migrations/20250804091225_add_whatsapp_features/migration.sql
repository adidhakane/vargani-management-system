-- AlterTable
ALTER TABLE "public"."receipts" ADD COLUMN     "add_to_whatsapp" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "whatsapp_status" TEXT;

-- CreateTable
CREATE TABLE "public"."whatsapp_configs" (
    "id" SERIAL NOT NULL,
    "group_name" TEXT NOT NULL,
    "group_id" TEXT,
    "invite_link" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "whatsapp_configs_pkey" PRIMARY KEY ("id")
);
