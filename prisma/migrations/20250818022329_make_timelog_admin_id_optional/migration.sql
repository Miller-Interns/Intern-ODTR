-- DropForeignKey
ALTER TABLE "public"."time_logs" DROP CONSTRAINT "time_logs_admin_id_fkey";

-- AlterTable
ALTER TABLE "public"."time_logs" ALTER COLUMN "admin_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."time_logs" ADD CONSTRAINT "time_logs_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
