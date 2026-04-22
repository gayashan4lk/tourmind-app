-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('host', 'tourist');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'tourist';
