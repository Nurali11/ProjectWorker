/*
  Warnings:

  - You are about to drop the `_MasterTools` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `levelId` on table `Master` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productId` on table `Master` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `description` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Master" DROP CONSTRAINT "Master_levelId_fkey";

-- DropForeignKey
ALTER TABLE "Master" DROP CONSTRAINT "Master_productId_fkey";

-- DropForeignKey
ALTER TABLE "_MasterTools" DROP CONSTRAINT "_MasterTools_A_fkey";

-- DropForeignKey
ALTER TABLE "_MasterTools" DROP CONSTRAINT "_MasterTools_B_fkey";

-- AlterTable
ALTER TABLE "Master" ALTER COLUMN "levelId" SET NOT NULL,
ALTER COLUMN "productId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "description" TEXT NOT NULL;

-- DropTable
DROP TABLE "_MasterTools";

-- AddForeignKey
ALTER TABLE "Master" ADD CONSTRAINT "Master_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Master" ADD CONSTRAINT "Master_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
