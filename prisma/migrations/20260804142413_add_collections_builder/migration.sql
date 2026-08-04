-- CreateEnum
CREATE TYPE "CollectionStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CollectionType" AS ENUM ('PLAYER', 'ERA', 'TOURNAMENT', 'THEME', 'BRAND', 'OTHER');

-- AlterTable
ALTER TABLE "MediaAsset" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "MuseumCollection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "eyebrow" TEXT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "type" "CollectionType" NOT NULL DEFAULT 'PLAYER',
    "status" "CollectionStatus" NOT NULL DEFAULT 'DRAFT',
    "heroTitle" TEXT,
    "heroSubtitle" TEXT,
    "heroImageUrl" TEXT,
    "heroMediaId" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#C8FF00',
    "secondaryColor" TEXT NOT NULL DEFAULT '#08111F',
    "accentColor" TEXT NOT NULL DEFAULT '#FFFFFF',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MuseumCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MuseumCollectionPlayer" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MuseumCollectionPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MuseumCollectionArtifact" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "artifactId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MuseumCollectionArtifact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MuseumCollectionOriginal" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "originalProductId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MuseumCollectionOriginal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MuseumCollectionMedia" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MuseumCollectionMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MuseumCollection_slug_key" ON "MuseumCollection"("slug");

-- CreateIndex
CREATE INDEX "MuseumCollection_name_idx" ON "MuseumCollection"("name");

-- CreateIndex
CREATE INDEX "MuseumCollection_type_idx" ON "MuseumCollection"("type");

-- CreateIndex
CREATE INDEX "MuseumCollection_status_idx" ON "MuseumCollection"("status");

-- CreateIndex
CREATE INDEX "MuseumCollection_featured_idx" ON "MuseumCollection"("featured");

-- CreateIndex
CREATE INDEX "MuseumCollection_displayOrder_idx" ON "MuseumCollection"("displayOrder");

-- CreateIndex
CREATE INDEX "MuseumCollection_publishedAt_idx" ON "MuseumCollection"("publishedAt");

-- CreateIndex
CREATE INDEX "MuseumCollection_heroMediaId_idx" ON "MuseumCollection"("heroMediaId");

-- CreateIndex
CREATE INDEX "MuseumCollection_createdAt_idx" ON "MuseumCollection"("createdAt");

-- CreateIndex
CREATE INDEX "MuseumCollectionPlayer_collectionId_idx" ON "MuseumCollectionPlayer"("collectionId");

-- CreateIndex
CREATE INDEX "MuseumCollectionPlayer_playerId_idx" ON "MuseumCollectionPlayer"("playerId");

-- CreateIndex
CREATE INDEX "MuseumCollectionPlayer_sortOrder_idx" ON "MuseumCollectionPlayer"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "MuseumCollectionPlayer_collectionId_playerId_key" ON "MuseumCollectionPlayer"("collectionId", "playerId");

-- CreateIndex
CREATE INDEX "MuseumCollectionArtifact_collectionId_idx" ON "MuseumCollectionArtifact"("collectionId");

-- CreateIndex
CREATE INDEX "MuseumCollectionArtifact_artifactId_idx" ON "MuseumCollectionArtifact"("artifactId");

-- CreateIndex
CREATE INDEX "MuseumCollectionArtifact_sortOrder_idx" ON "MuseumCollectionArtifact"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "MuseumCollectionArtifact_collectionId_artifactId_key" ON "MuseumCollectionArtifact"("collectionId", "artifactId");

-- CreateIndex
CREATE INDEX "MuseumCollectionOriginal_collectionId_idx" ON "MuseumCollectionOriginal"("collectionId");

-- CreateIndex
CREATE INDEX "MuseumCollectionOriginal_originalProductId_idx" ON "MuseumCollectionOriginal"("originalProductId");

-- CreateIndex
CREATE INDEX "MuseumCollectionOriginal_sortOrder_idx" ON "MuseumCollectionOriginal"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "MuseumCollectionOriginal_collectionId_originalProductId_key" ON "MuseumCollectionOriginal"("collectionId", "originalProductId");

-- CreateIndex
CREATE INDEX "MuseumCollectionMedia_collectionId_idx" ON "MuseumCollectionMedia"("collectionId");

-- CreateIndex
CREATE INDEX "MuseumCollectionMedia_mediaAssetId_idx" ON "MuseumCollectionMedia"("mediaAssetId");

-- CreateIndex
CREATE INDEX "MuseumCollectionMedia_sortOrder_idx" ON "MuseumCollectionMedia"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "MuseumCollectionMedia_collectionId_mediaAssetId_key" ON "MuseumCollectionMedia"("collectionId", "mediaAssetId");

-- CreateIndex
CREATE INDEX "MediaAsset_title_idx" ON "MediaAsset"("title");

-- CreateIndex
CREATE INDEX "MediaAsset_originalName_idx" ON "MediaAsset"("originalName");

-- CreateIndex
CREATE INDEX "MediaAsset_mimeType_idx" ON "MediaAsset"("mimeType");

-- CreateIndex
CREATE INDEX "MediaAsset_extension_idx" ON "MediaAsset"("extension");

-- CreateIndex
CREATE INDEX "MediaAsset_folderId_idx" ON "MediaAsset"("folderId");

-- CreateIndex
CREATE INDEX "MediaAsset_isUsed_idx" ON "MediaAsset"("isUsed");

-- CreateIndex
CREATE INDEX "MediaAsset_createdAt_idx" ON "MediaAsset"("createdAt");

-- CreateIndex
CREATE INDEX "MediaFolder_name_idx" ON "MediaFolder"("name");

-- CreateIndex
CREATE INDEX "MediaFolder_createdAt_idx" ON "MediaFolder"("createdAt");

-- AddForeignKey
ALTER TABLE "MuseumCollection" ADD CONSTRAINT "MuseumCollection_heroMediaId_fkey" FOREIGN KEY ("heroMediaId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MuseumCollectionPlayer" ADD CONSTRAINT "MuseumCollectionPlayer_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "MuseumCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MuseumCollectionPlayer" ADD CONSTRAINT "MuseumCollectionPlayer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MuseumCollectionArtifact" ADD CONSTRAINT "MuseumCollectionArtifact_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "MuseumCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MuseumCollectionArtifact" ADD CONSTRAINT "MuseumCollectionArtifact_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "Artifact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MuseumCollectionOriginal" ADD CONSTRAINT "MuseumCollectionOriginal_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "MuseumCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MuseumCollectionOriginal" ADD CONSTRAINT "MuseumCollectionOriginal_originalProductId_fkey" FOREIGN KEY ("originalProductId") REFERENCES "OriginalProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MuseumCollectionMedia" ADD CONSTRAINT "MuseumCollectionMedia_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "MuseumCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MuseumCollectionMedia" ADD CONSTRAINT "MuseumCollectionMedia_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
