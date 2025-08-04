-- AlterTable
ALTER TABLE "public"."receipts" ADD COLUMN     "payment_mode" TEXT NOT NULL DEFAULT 'cash';
