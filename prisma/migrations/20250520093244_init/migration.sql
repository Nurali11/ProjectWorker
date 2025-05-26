/*
  Warnings:

  - You are about to drop the column `masterId` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_masterId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "masterId",
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "_OrderMasters" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_OrderMasters_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_OrderMasters_B_index" ON "_OrderMasters"("B");

-- AddForeignKey
ALTER TABLE "_OrderMasters" ADD CONSTRAINT "_OrderMasters_A_fkey" FOREIGN KEY ("A") REFERENCES "Master"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderMasters" ADD CONSTRAINT "_OrderMasters_B_fkey" FOREIGN KEY ("B") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
