/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `place` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `place` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "category" DROP CONSTRAINT "category_userId_fkey";

-- DropForeignKey
ALTER TABLE "image" DROP CONSTRAINT "image_placeId_fkey";

-- DropForeignKey
ALTER TABLE "place" DROP CONSTRAINT "place_userId_fkey";

-- AlterTable
ALTER TABLE "image" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "place" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "image_placeId_idx" ON "image"("placeId");

-- CreateIndex
CREATE UNIQUE INDEX "place_userId_name_key" ON "place"("userId", "name");

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place" ADD CONSTRAINT "place_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image" ADD CONSTRAINT "image_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "place"("id") ON DELETE CASCADE ON UPDATE CASCADE;
