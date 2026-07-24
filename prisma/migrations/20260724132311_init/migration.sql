/*
  Warnings:

  - A unique constraint covering the columns `[authenticityCode]` on the table `Artifact` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ArtifactCategory" AS ENUM ('SHIRT', 'POLO', 'JACKET', 'SHORTS', 'SHOES', 'CAP', 'ACCESSORY');

-- CreateEnum
CREATE TYPE "ArtifactRarity" AS ENUM ('COMMON', 'RARE', 'VERY_RARE', 'LEGENDARY');

-- CreateEnum
CREATE TYPE "ArtifactAvailability" AS ENUM ('AVAILABLE', 'SOLD', 'COMING_SOON', 'NOT_FOR_SALE');

-- AlterTable
ALTER TABLE "Artifact" ADD COLUMN     "authentic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "authenticityCode" TEXT,
ADD COLUMN     "availability" "ArtifactAvailability" NOT NULL DEFAULT 'COMING_SOON',
ADD COLUMN     "category" "ArtifactCategory",
ADD COLUMN     "collection" TEXT,
ADD COLUMN     "curatorNote" TEXT,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'EUR',
ADD COLUMN     "edition" TEXT,
ADD COLUMN     "historicalContext" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "museumStory" TEXT,
ADD COLUMN     "price" DECIMAL(10,2),
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "rarity" "ArtifactRarity" NOT NULL DEFAULT 'COMMON',
ADD COLUMN     "season" TEXT,
ADD COLUMN     "subtitle" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "tournament" TEXT,
ADD COLUMN     "vintage" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "vintedUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Artifact_authenticityCode_key" ON "Artifact"("authenticityCode");

-- CreateIndex
CREATE INDEX "Artifact_availability_idx" ON "Artifact"("availability");

-- CreateIndex
CREATE INDEX "Artifact_category_idx" ON "Artifact"("category");

-- CreateIndex
CREATE INDEX "Artifact_rarity_idx" ON "Artifact"("rarity");

-- CreateIndex
CREATE INDEX "Artifact_publishedAt_idx" ON "Artifact"("publishedAt");

-- CreateIndex
CREATE INDEX "Artifact_year_idx" ON "Artifact"("year");

-- CreateIndex
CREATE INDEX "Artifact_tournament_idx" ON "Artifact"("tournament");

-- CreateIndex
CREATE INDEX "Artifact_collection_idx" ON "Artifact"("collection");
