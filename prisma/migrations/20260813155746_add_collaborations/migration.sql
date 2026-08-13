-- CreateEnum
CREATE TYPE "CollaborationPartnerType" AS ENUM ('TENNIS_BRAND', 'CLUB_EVENT', 'CREATIVE_STUDIO', 'COLLECTOR', 'OTHER');

-- CreateEnum
CREATE TYPE "CollaborationProjectType" AS ENUM ('ARCHIVE_STORY', 'LIMITED_CAPSULE', 'EXHIBITION_POPUP', 'CAMPAIGN_CONTENT', 'OTHER');

-- CreateTable
CREATE TABLE "Collaboration" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "eyebrow" TEXT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "story" TEXT,
    "partnerName" TEXT NOT NULL,
    "partnerType" "CollaborationPartnerType" NOT NULL,
    "location" TEXT,
    "year" INTEGER,
    "period" TEXT,
    "projectTitle" TEXT,
    "projectType" "CollaborationProjectType",
    "outcome" TEXT,
    "websiteUrl" TEXT,
    "href" TEXT,
    "imageUrl" TEXT,
    "mediaId" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "MuseumPageStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collaboration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Collaboration_slug_key" ON "Collaboration"("slug");

-- CreateIndex
CREATE INDEX "Collaboration_partnerName_idx" ON "Collaboration"("partnerName");

-- CreateIndex
CREATE INDEX "Collaboration_partnerType_idx" ON "Collaboration"("partnerType");

-- CreateIndex
CREATE INDEX "Collaboration_projectType_idx" ON "Collaboration"("projectType");

-- CreateIndex
CREATE INDEX "Collaboration_year_idx" ON "Collaboration"("year");

-- CreateIndex
CREATE INDEX "Collaboration_status_idx" ON "Collaboration"("status");

-- CreateIndex
CREATE INDEX "Collaboration_featured_idx" ON "Collaboration"("featured");

-- CreateIndex
CREATE INDEX "Collaboration_sortOrder_idx" ON "Collaboration"("sortOrder");

-- CreateIndex
CREATE INDEX "Collaboration_mediaId_idx" ON "Collaboration"("mediaId");

-- CreateIndex
CREATE INDEX "Collaboration_publishedAt_idx" ON "Collaboration"("publishedAt");

-- CreateIndex
CREATE INDEX "Collaboration_createdAt_idx" ON "Collaboration"("createdAt");

-- AddForeignKey
ALTER TABLE "Collaboration" ADD CONSTRAINT "Collaboration_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
