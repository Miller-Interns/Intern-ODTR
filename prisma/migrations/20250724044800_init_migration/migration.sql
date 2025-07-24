-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Batch" (
    "id" TEXT NOT NULL,
    "batch_number" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Intern" (
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

    CONSTRAINT "Intern_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeLog" (
    "id" TEXT NOT NULL,
    "intern_id" TEXT NOT NULL,
    "time_in" TIMESTAMP(3) NOT NULL,
    "time_out" TIMESTAMP(3) NOT NULL,
    "overtime" INTEGER,
    "total_hours" INTEGER NOT NULL,
    "remarks" TEXT,
    "status" BOOLEAN NOT NULL,
    "admin_id" TEXT NOT NULL,

    CONSTRAINT "TimeLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Intern_user_id_key" ON "Intern"("user_id");

-- AddForeignKey
ALTER TABLE "Intern" ADD CONSTRAINT "Intern_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intern" ADD CONSTRAINT "Intern_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "Batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeLog" ADD CONSTRAINT "TimeLog_intern_id_fkey" FOREIGN KEY ("intern_id") REFERENCES "Intern"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeLog" ADD CONSTRAINT "TimeLog_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
