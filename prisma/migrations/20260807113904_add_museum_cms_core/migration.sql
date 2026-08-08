-- CreateEnum
CREATE TYPE "MuseumPageStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "MuseumSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "group" TEXT NOT NULL DEFAULT 'general',
    "label" TEXT,
    "description" TEXT,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MuseumSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MuseumPage" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "eyebrow" TEXT,
    "subtitle" TEXT,
    "excerpt" TEXT,
    "content" TEXT,
    "heroImage" TEXT,
    "status" "MuseumPageStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "canonicalUrl" TEXT,
    "openGraphImage" TEXT,
    "robotsIndex" BOOLEAN NOT NULL DEFAULT true,
    "robotsFollow" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MuseumPage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MuseumSetting_key_key" ON "MuseumSetting"("key");

-- CreateIndex
CREATE INDEX "MuseumSetting_group_idx" ON "MuseumSetting"("group");

-- CreateIndex
CREATE INDEX "MuseumSetting_updatedAt_idx" ON "MuseumSetting"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "MuseumPage_slug_key" ON "MuseumPage"("slug");

-- CreateIndex
CREATE INDEX "MuseumPage_status_idx" ON "MuseumPage"("status");

-- CreateIndex
CREATE INDEX "MuseumPage_featured_idx" ON "MuseumPage"("featured");

-- CreateIndex
CREATE INDEX "MuseumPage_displayOrder_idx" ON "MuseumPage"("displayOrder");

-- CreateIndex
CREATE INDEX "MuseumPage_publishedAt_idx" ON "MuseumPage"("publishedAt");

-- CreateIndex
CREATE INDEX "MuseumPage_updatedAt_idx" ON "MuseumPage"("updatedAt");
