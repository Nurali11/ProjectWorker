-- AlterTable
ALTER TABLE "Master" ADD COLUMN     "levelId" INTEGER,
ADD COLUMN     "regionId" INTEGER;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "masterId" INTEGER;

-- CreateTable
CREATE TABLE "_MasterTools" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MasterTools_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MasterTools_B_index" ON "_MasterTools"("B");

-- AddForeignKey
ALTER TABLE "Master" ADD CONSTRAINT "Master_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Master" ADD CONSTRAINT "Master_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_masterId_fkey" FOREIGN KEY ("masterId") REFERENCES "Master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MasterTools" ADD CONSTRAINT "_MasterTools_A_fkey" FOREIGN KEY ("A") REFERENCES "Master"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MasterTools" ADD CONSTRAINT "_MasterTools_B_fkey" FOREIGN KEY ("B") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;
