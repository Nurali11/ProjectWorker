/*
  Warnings:

  - You are about to drop the column `star` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Star` table. All the data in the column will be lost.
  - Added the required column `start` to the `Star` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Star" DROP CONSTRAINT "Star_userId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "star",
ADD COLUMN     "orderId" INTEGER,
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Star" DROP COLUMN "userId",
ADD COLUMN     "commentId" INTEGER,
ADD COLUMN     "start" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Star" ADD CONSTRAINT "Star_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
