-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterRating" (
    "id" SERIAL NOT NULL,
    "star" DOUBLE PRECISION NOT NULL,
    "commentId" INTEGER NOT NULL,
    "masterId" INTEGER NOT NULL,

    CONSTRAINT "MasterRating_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MasterRating" ADD CONSTRAINT "MasterRating_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterRating" ADD CONSTRAINT "MasterRating_masterId_fkey" FOREIGN KEY ("masterId") REFERENCES "Master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
