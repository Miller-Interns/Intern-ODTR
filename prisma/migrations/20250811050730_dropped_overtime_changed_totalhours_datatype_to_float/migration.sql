/*
  Warnings:

  - You are about to drop the column `overtime` on the `time_logs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."time_logs" DROP COLUMN "overtime",
ALTER COLUMN "total_hours" SET DATA TYPE DOUBLE PRECISION;
