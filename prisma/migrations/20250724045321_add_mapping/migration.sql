/*
  Warnings:

  - You are about to drop the `Batch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Intern` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TimeLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Intern" DROP CONSTRAINT "Intern_batch_id_fkey";

-- DropForeignKey
ALTER TABLE "Intern" DROP CONSTRAINT "Intern_user_id_fkey";

-- DropForeignKey
ALTER TABLE "TimeLog" DROP CONSTRAINT "TimeLog_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "TimeLog" DROP CONSTRAINT "TimeLog_intern_id_fkey";

-- DropTable
DROP TABLE "Batch";

-- DropTable
DROP TABLE "Intern";

-- DropTable
DROP TABLE "TimeLog";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batches" (
    "id" TEXT NOT NULL,
    "batch_number" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL,

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
    "required_hours" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "interns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_logs" (
    "id" TEXT NOT NULL,
    "intern_id" TEXT NOT NULL,
    "time_in" TIMESTAMP(3) NOT NULL,
    "time_out" TIMESTAMP(3) NOT NULL,
    "overtime" INTEGER,
    "total_hours" INTEGER NOT NULL,
    "remarks" TEXT,
    "status" BOOLEAN NOT NULL,
    "admin_id" TEXT NOT NULL,

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
ALTER TABLE "time_logs" ADD CONSTRAINT "time_logs_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
