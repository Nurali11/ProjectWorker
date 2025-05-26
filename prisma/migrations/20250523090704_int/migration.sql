/*
  Warnings:

  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MasterRating` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `location` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "MasterRating" DROP CONSTRAINT "MasterRating_commentId_fkey";

-- DropForeignKey
ALTER TABLE "MasterRating" DROP CONSTRAINT "MasterRating_masterId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "commentToDelivery" TEXT,
ADD COLUMN     "paymentType" TEXT,
ADD COLUMN     "withDelivery" BOOLEAN,
DROP COLUMN "location",
ADD COLUMN     "location" JSONB NOT NULL;

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "MasterRating";

-- CreateTable
CREATE TABLE "GeneralInfo" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "links" TEXT NOT NULL,
    "phones" TEXT NOT NULL,

    CONSTRAINT "GeneralInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQ" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);
