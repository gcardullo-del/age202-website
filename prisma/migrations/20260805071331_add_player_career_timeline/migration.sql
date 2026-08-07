-- CreateEnum
CREATE TYPE "CareerEventCategory" AS ENUM ('DEBUT', 'RANKING', 'TITLE', 'GRAND_SLAM', 'MASTERS_1000', 'ATP_FINALS', 'OLYMPICS', 'DAVIS_CUP', 'RIVALRY', 'COMEBACK', 'RETIREMENT', 'MILESTONE', 'OTHER');

-- CreateTable
CREATE TABLE "PlayerCareerEvent" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER,
    "day" INTEGER,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "category" "CareerEventCategory" NOT NULL DEFAULT 'MILESTONE',
    "imageUrl" TEXT,
    "location" TEXT,
    "tournament" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerCareerEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlayerCareerEvent_playerId_idx" ON "PlayerCareerEvent"("playerId");

-- CreateIndex
CREATE INDEX "PlayerCareerEvent_playerId_year_idx" ON "PlayerCareerEvent"("playerId", "year");

-- CreateIndex
CREATE INDEX "PlayerCareerEvent_playerId_sortOrder_idx" ON "PlayerCareerEvent"("playerId", "sortOrder");

-- CreateIndex
CREATE INDEX "PlayerCareerEvent_category_idx" ON "PlayerCareerEvent"("category");

-- CreateIndex
CREATE INDEX "PlayerCareerEvent_featured_idx" ON "PlayerCareerEvent"("featured");

-- CreateIndex
CREATE INDEX "PlayerCareerEvent_year_idx" ON "PlayerCareerEvent"("year");

-- AddForeignKey
ALTER TABLE "PlayerCareerEvent" ADD CONSTRAINT "PlayerCareerEvent_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
