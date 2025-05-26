/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Star` table. All the data in the column will be lost.
  - You are about to drop the column `toolId` on the `Star` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Star" DROP COLUMN "createdAt",
DROP COLUMN "toolId",
ALTER COLUMN "masterId" DROP NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "star" DOUBLE PRECISION NOT NULL,
    "masterId" INTEGER,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_masterId_fkey" FOREIGN KEY ("masterId") REFERENCES "Master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Star" ADD CONSTRAINT "Star_masterId_fkey" FOREIGN KEY ("masterId") REFERENCES "Master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Star" ADD CONSTRAINT "Star_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
