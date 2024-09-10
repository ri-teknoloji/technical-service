/*
  Warnings:

  - The `status` column on the `service_records` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ServiceRecordStatus" AS ENUM ('pending', 'in_progress', 'shipped', 'completed');

-- AlterTable
ALTER TABLE "service_records" ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
DROP COLUMN "status",
ADD COLUMN     "status" "ServiceRecordStatus" NOT NULL DEFAULT 'pending';
