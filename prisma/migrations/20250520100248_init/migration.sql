-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('VERIFIED', 'UNVERIFIED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'UNVERIFIED';
