/*
  Warnings:

  - Changed the type of `status` on the `interns` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('INCOMING', 'ONGOING', 'COMPLETED');

-- AlterTable
ALTER TABLE "public"."interns" ADD COLUMN     "hours_completed" INTEGER,
ADD COLUMN     "intern_picture" TEXT,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'Web Developer',
DROP COLUMN "status",
ADD COLUMN     "status" "public"."Status" NOT NULL;
