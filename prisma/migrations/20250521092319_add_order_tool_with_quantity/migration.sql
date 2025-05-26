-- CreateTable
CREATE TABLE "OrderTool" (
    "orderId" INTEGER NOT NULL,
    "toolId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "OrderTool_pkey" PRIMARY KEY ("orderId","toolId")
);

-- AddForeignKey
ALTER TABLE "OrderTool" ADD CONSTRAINT "OrderTool_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderTool" ADD CONSTRAINT "OrderTool_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
