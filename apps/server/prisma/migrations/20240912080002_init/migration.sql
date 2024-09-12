/*
  Warnings:

  - The `roles` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'admin', 'technician');

-- AlterTable
ALTER TABLE "service_records" ADD COLUMN     "technicianId" TEXT NOT NULL DEFAULT '0';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "roles",
ADD COLUMN     "roles" "UserRole"[] DEFAULT ARRAY['user']::"UserRole"[];

-- AddForeignKey
ALTER TABLE "service_records" ADD CONSTRAINT "service_records_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
