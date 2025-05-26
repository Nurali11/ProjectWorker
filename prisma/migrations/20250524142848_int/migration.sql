/*
  Warnings:

  - You are about to drop the column `masterId` on the `Comment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_masterId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "masterId";
