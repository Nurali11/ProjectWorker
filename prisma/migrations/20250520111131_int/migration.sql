-- AlterTable
ALTER TABLE "Master" ADD COLUMN     "productId" INTEGER;

-- AddForeignKey
ALTER TABLE "Master" ADD CONSTRAINT "Master_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
