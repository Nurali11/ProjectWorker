/*
  Warnings:

  - You are about to drop the column `productId` on the `Master` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Master" DROP CONSTRAINT "Master_productId_fkey";

-- AlterTable
ALTER TABLE "Master" DROP COLUMN "productId";

-- CreateTable
CREATE TABLE "_MasterProducts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MasterProducts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MasterProducts_B_index" ON "_MasterProducts"("B");

-- AddForeignKey
ALTER TABLE "_MasterProducts" ADD CONSTRAINT "_MasterProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "Master"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MasterProducts" ADD CONSTRAINT "_MasterProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
