/*
  Warnings:

  - The `status` column on the `batches` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `remarks` on the `time_logs` table. All the data in the column will be lost.
  - Added the required column `supervisorId` to the `batches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."batches" ADD COLUMN     "supervisorId" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."Status" NOT NULL DEFAULT 'INCOMING';

-- AlterTable
ALTER TABLE "public"."time_logs" DROP COLUMN "remarks",
ADD COLUMN     "admin_remarks" TEXT,
ADD COLUMN     "intern_notes" TEXT;

-- AddForeignKey
ALTER TABLE "public"."batches" ADD CONSTRAINT "batches_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
