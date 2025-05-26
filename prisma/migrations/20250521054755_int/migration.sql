/*
  Warnings:

  - You are about to drop the column `productId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `toolId` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_productId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_toolId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "productId",
DROP COLUMN "toolId";

-- CreateTable
CREATE TABLE "_OrderTools" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_OrderTools_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_OrderProducts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_OrderProducts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_OrderTools_B_index" ON "_OrderTools"("B");

-- CreateIndex
CREATE INDEX "_OrderProducts_B_index" ON "_OrderProducts"("B");

-- AddForeignKey
ALTER TABLE "_OrderTools" ADD CONSTRAINT "_OrderTools_A_fkey" FOREIGN KEY ("A") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderTools" ADD CONSTRAINT "_OrderTools_B_fkey" FOREIGN KEY ("B") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderProducts" ADD CONSTRAINT "_OrderProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderProducts" ADD CONSTRAINT "_OrderProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
