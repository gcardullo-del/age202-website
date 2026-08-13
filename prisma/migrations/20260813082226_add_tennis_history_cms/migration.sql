-- CreateEnum
CREATE TYPE "TennisHistoryEntryType" AS ENUM ('MILESTONE', 'LEGEND', 'RIVALRY', 'GENERATION');

-- CreateEnum
CREATE TYPE "TennisHistoryEra" AS ENUM ('ORIGINS', 'CLASSIC_ERA', 'OPEN_ERA', 'MODERN_ERA');

-- CreateEnum
CREATE TYPE "TennisHistoryGender" AS ENUM ('MEN', 'WOMEN', 'MIXED');

-- CreateTable
CREATE TABLE "TennisHistoryEntry" (
    "id" TEXT NOT NULL,
    "type" "TennisHistoryEntryType" NOT NULL,
    "slug" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "era" "TennisHistoryEra" NOT NULL,
    "gender" "TennisHistoryGender",
    "eyebrow" TEXT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "quote" TEXT,
    "achievement" TEXT,
    "period" TEXT,
    "country" TEXT,
    "countryCode" TEXT,
    "playerOne" TEXT,
    "playerTwo" TEXT,
    "players" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "href" TEXT,
    "imageUrl" TEXT,
    "mediaId" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "MuseumPageStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TennisHistoryEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TennisHistoryEntry_slug_key" ON "TennisHistoryEntry"("slug");

-- CreateIndex
CREATE INDEX "TennisHistoryEntry_type_idx" ON "TennisHistoryEntry"("type");

-- CreateIndex
CREATE INDEX "TennisHistoryEntry_year_idx" ON "TennisHistoryEntry"("year");

-- CreateIndex
CREATE INDEX "TennisHistoryEntry_era_idx" ON "TennisHistoryEntry"("era");

-- CreateIndex
CREATE INDEX "TennisHistoryEntry_status_idx" ON "TennisHistoryEntry"("status");

-- CreateIndex
CREATE INDEX "TennisHistoryEntry_featured_idx" ON "TennisHistoryEntry"("featured");

-- CreateIndex
CREATE INDEX "TennisHistoryEntry_sortOrder_idx" ON "TennisHistoryEntry"("sortOrder");

-- CreateIndex
CREATE INDEX "TennisHistoryEntry_mediaId_idx" ON "TennisHistoryEntry"("mediaId");

-- CreateIndex
CREATE INDEX "TennisHistoryEntry_publishedAt_idx" ON "TennisHistoryEntry"("publishedAt");

-- CreateIndex
CREATE INDEX "TennisHistoryEntry_year_sortOrder_idx" ON "TennisHistoryEntry"("year", "sortOrder");

-- AddForeignKey
ALTER TABLE "TennisHistoryEntry" ADD CONSTRAINT "TennisHistoryEntry_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
