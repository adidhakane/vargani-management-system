-- CreateTable
CREATE TABLE "public"."residents" (
    "id" SERIAL NOT NULL,
    "building_no" TEXT NOT NULL,
    "flat_no" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact_no" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "residents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."receipts" (
    "id" SERIAL NOT NULL,
    "building_no" TEXT NOT NULL,
    "flat_no" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "name" TEXT,
    "contact_no" TEXT,
    "date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "receipts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "residents_building_no_flat_no_key" ON "public"."residents"("building_no", "flat_no");

-- AddForeignKey
ALTER TABLE "public"."receipts" ADD CONSTRAINT "receipts_building_no_flat_no_fkey" FOREIGN KEY ("building_no", "flat_no") REFERENCES "public"."residents"("building_no", "flat_no") ON DELETE RESTRICT ON UPDATE CASCADE;
