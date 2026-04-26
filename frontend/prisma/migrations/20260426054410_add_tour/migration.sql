-- CreateTable
CREATE TABLE "tour" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_item" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "tour_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tour_userId_idx" ON "tour"("userId");

-- CreateIndex
CREATE INDEX "tour_item_tourId_idx" ON "tour_item"("tourId");

-- CreateIndex
CREATE INDEX "tour_item_placeId_idx" ON "tour_item"("placeId");

-- CreateIndex
CREATE UNIQUE INDEX "tour_item_tourId_position_key" ON "tour_item"("tourId", "position");

-- AddForeignKey
ALTER TABLE "tour" ADD CONSTRAINT "tour_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_item" ADD CONSTRAINT "tour_item_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_item" ADD CONSTRAINT "tour_item_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
