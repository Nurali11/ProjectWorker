/*
  Warnings:

  - You are about to drop the column `start` on the `Star` table. All the data in the column will be lost.
  - Added the required column `star` to the `Star` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Star" DROP COLUMN "start",
ADD COLUMN     "star" INTEGER NOT NULL;
