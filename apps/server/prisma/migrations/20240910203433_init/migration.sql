/*
  Warnings:

  - Added the required column `estimatedCost` to the `service_records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimatedDelivery` to the `service_records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productImeiNumber` to the `service_records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productSerialNumber` to the `service_records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `service_records` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ServiceRecordStatus" ADD VALUE 'waiting_for_parts';
ALTER TYPE "ServiceRecordStatus" ADD VALUE 'delivered';

-- AlterTable
ALTER TABLE "service_records" ADD COLUMN     "estimatedCost" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "estimatedDelivery" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "productImeiNumber" TEXT NOT NULL,
ADD COLUMN     "productSerialNumber" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "images" DROP DEFAULT,
ALTER COLUMN "description" DROP DEFAULT;
