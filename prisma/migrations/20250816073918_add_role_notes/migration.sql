/*
  Warnings:

  - You are about to drop the `batches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `interns` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `time_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."interns" DROP CONSTRAINT "interns_batch_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."interns" DROP CONSTRAINT "interns_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."time_logs" DROP CONSTRAINT "time_logs_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."time_logs" DROP CONSTRAINT "time_logs_intern_id_fkey";

-- DropTable
DROP TABLE "public"."batches";

-- DropTable
DROP TABLE "public"."interns";

-- DropTable
DROP TABLE "public"."time_logs";

-- DropTable
DROP TABLE "public"."users";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" VARCHAR(255),
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batches" (
    "id" TEXT NOT NULL,
    "batch_number" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interns" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "emergency_contact_person" TEXT NOT NULL,
    "emergency_contact_number" TEXT NOT NULL,
    "required_hours" DOUBLE PRECISION NOT NULL,
    "status" BOOLEAN NOT NULL,
    "hours_completed" DOUBLE PRECISION NOT NULL,
    "role" TEXT,
    "notes" TEXT,

    CONSTRAINT "interns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_logs" (
    "id" TEXT NOT NULL,
    "intern_id" TEXT NOT NULL,
    "time_in" TIMESTAMP(3) NOT NULL,
    "time_out" TIMESTAMP(3),
    "total_hours" DOUBLE PRECISION NOT NULL,
    "admin_remarks" TEXT,
    "intern_notes" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "admin_id" TEXT,

    CONSTRAINT "time_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "interns_user_id_key" ON "interns"("user_id");

-- AddForeignKey
ALTER TABLE "interns" ADD CONSTRAINT "interns_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interns" ADD CONSTRAINT "interns_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_logs" ADD CONSTRAINT "time_logs_intern_id_fkey" FOREIGN KEY ("intern_id") REFERENCES "interns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_logs" ADD CONSTRAINT "time_logs_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
