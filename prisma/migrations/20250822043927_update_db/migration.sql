/*
  Warnings:

  - The `status` column on the `batches` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `interns` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `overtime` on the `time_logs` table. All the data in the column will be lost.
  - You are about to drop the column `remarks` on the `time_logs` table. All the data in the column will be lost.
  - Added the required column `supervisorId` to the `batches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `interns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `interns` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('INCOMING', 'ONGOING', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "public"."time_logs" DROP CONSTRAINT "time_logs_admin_id_fkey";

-- AlterTable
ALTER TABLE "public"."batches" ADD COLUMN     "supervisorId" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."Status" NOT NULL DEFAULT 'INCOMING';

-- AlterTable
ALTER TABLE "public"."interns" ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "hours_completed" DOUBLE PRECISION,
ADD COLUMN     "intern_picture" TEXT,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "middle_name" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "role" TEXT,
ALTER COLUMN "course" DROP NOT NULL,
ALTER COLUMN "year" DROP NOT NULL,
ALTER COLUMN "contact_number" DROP NOT NULL,
ALTER COLUMN "emergency_contact_person" DROP NOT NULL,
ALTER COLUMN "emergency_contact_number" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."Status" NOT NULL DEFAULT 'INCOMING';

-- AlterTable
ALTER TABLE "public"."time_logs" DROP COLUMN "overtime",
DROP COLUMN "remarks",
ADD COLUMN     "admin_remarks" TEXT,
ADD COLUMN     "intern_notes" TEXT,
ALTER COLUMN "time_out" DROP NOT NULL,
ALTER COLUMN "total_hours" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "admin_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."batches" ADD CONSTRAINT "batches_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."time_logs" ADD CONSTRAINT "time_logs_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
