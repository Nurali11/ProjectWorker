-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Master" DROP CONSTRAINT "Master_levelId_fkey";

-- DropForeignKey
ALTER TABLE "Master" DROP CONSTRAINT "Master_regionId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrderTool" DROP CONSTRAINT "OrderTool_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrderTool" DROP CONSTRAINT "OrderTool_toolId_fkey";

-- DropForeignKey
ALTER TABLE "Sessions" DROP CONSTRAINT "Sessions_userId_fkey";

-- DropForeignKey
ALTER TABLE "Star" DROP CONSTRAINT "Star_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Star" DROP CONSTRAINT "Star_masterId_fkey";

-- DropForeignKey
ALTER TABLE "Tool" DROP CONSTRAINT "Tool_brandId_fkey";

-- DropForeignKey
ALTER TABLE "Tool" DROP CONSTRAINT "Tool_capacityId_fkey";

-- DropForeignKey
ALTER TABLE "Tool" DROP CONSTRAINT "Tool_productId_fkey";

-- DropForeignKey
ALTER TABLE "Tool" DROP CONSTRAINT "Tool_sizeId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_regionId_fkey";

-- AddForeignKey
ALTER TABLE "Sessions" ADD CONSTRAINT "Sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Master" ADD CONSTRAINT "Master_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Master" ADD CONSTRAINT "Master_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Size"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_capacityId_fkey" FOREIGN KEY ("capacityId") REFERENCES "Capacity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderTool" ADD CONSTRAINT "OrderTool_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderTool" ADD CONSTRAINT "OrderTool_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Star" ADD CONSTRAINT "Star_masterId_fkey" FOREIGN KEY ("masterId") REFERENCES "Master"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Star" ADD CONSTRAINT "Star_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
