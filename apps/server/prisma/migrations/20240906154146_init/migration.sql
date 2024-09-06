-- AlterTable
ALTER TABLE "service_records" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
