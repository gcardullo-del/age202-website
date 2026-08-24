/*
  Warnings:

  - You are about to drop the column `productId` on the `OrderItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeProductId]` on the table `Artifact` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripePriceId]` on the table `Artifact` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `itemType` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderItemType" AS ENUM ('ARTIFACT', 'MEMORABILIA', 'ORIGINAL_PRODUCT');

-- CreateEnum
CREATE TYPE "MemorabiliaType" AS ENUM ('TRADING_CARD', 'SIGNED_JERSEY', 'SIGNED_RACQUET', 'SIGNED_BALL', 'SIGNED_PHOTO', 'SIGNED_ITEM', 'RACQUET', 'TROPHY', 'PROGRAMME', 'TICKET', 'OTHER');

-- CreateEnum
CREATE TYPE "MemorabiliaStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MemorabiliaAvailability" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD', 'COMING_SOON', 'NOT_FOR_SALE');

-- CreateEnum
CREATE TYPE "MemorabiliaCondition" AS ENUM ('MINT', 'NEAR_MINT', 'EXCELLENT', 'VERY_GOOD', 'GOOD', 'FAIR', 'POOR');

-- CreateEnum
CREATE TYPE "MemorabiliaRarity" AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'VERY_RARE', 'ULTRA_RARE', 'ONE_OF_ONE');

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";

-- DropIndex
DROP INDEX "OrderItem_productId_idx";

-- AlterTable
ALTER TABLE "Artifact" ADD COLUMN     "stripeActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stripePriceId" TEXT,
ADD COLUMN     "stripeProductId" TEXT;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "productId",
ADD COLUMN     "artifactId" TEXT,
ADD COLUMN     "itemType" "OrderItemType" NOT NULL,
ADD COLUMN     "memorabiliaId" TEXT,
ADD COLUMN     "originalProductId" TEXT;

-- CreateTable
CREATE TABLE "Memorabilia" (
    "id" TEXT NOT NULL,
    "inventoryNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "type" "MemorabiliaType" NOT NULL,
    "status" "MemorabiliaStatus" NOT NULL DEFAULT 'DRAFT',
    "availability" "MemorabiliaAvailability" NOT NULL DEFAULT 'COMING_SOON',
    "condition" "MemorabiliaCondition",
    "rarity" "MemorabiliaRarity" NOT NULL DEFAULT 'COMMON',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER,
    "playerId" TEXT,
    "year" INTEGER,
    "brand" TEXT,
    "collection" TEXT,
    "edition" TEXT,
    "serialNumber" TEXT,
    "cardSet" TEXT,
    "cardNumber" TEXT,
    "gradingCompany" TEXT,
    "grade" TEXT,
    "gradingCertNumber" TEXT,
    "signed" BOOLEAN NOT NULL DEFAULT false,
    "signedBy" TEXT,
    "signatureLocation" TEXT,
    "authentic" BOOLEAN NOT NULL DEFAULT false,
    "authenticationCompany" TEXT,
    "authenticityCode" TEXT,
    "certificateUrl" TEXT,
    "material" TEXT,
    "size" TEXT,
    "colour" TEXT,
    "price" DECIMAL(10,2),
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "publishedAt" TIMESTAMP(3),
    "stripeProductId" TEXT,
    "stripePriceId" TEXT,
    "stripeActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Memorabilia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemorabiliaImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "memorabiliaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemorabiliaImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Memorabilia_inventoryNumber_key" ON "Memorabilia"("inventoryNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Memorabilia_slug_key" ON "Memorabilia"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Memorabilia_gradingCertNumber_key" ON "Memorabilia"("gradingCertNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Memorabilia_authenticityCode_key" ON "Memorabilia"("authenticityCode");

-- CreateIndex
CREATE UNIQUE INDEX "Memorabilia_stripeProductId_key" ON "Memorabilia"("stripeProductId");

-- CreateIndex
CREATE UNIQUE INDEX "Memorabilia_stripePriceId_key" ON "Memorabilia"("stripePriceId");

-- CreateIndex
CREATE INDEX "Memorabilia_type_idx" ON "Memorabilia"("type");

-- CreateIndex
CREATE INDEX "Memorabilia_status_idx" ON "Memorabilia"("status");

-- CreateIndex
CREATE INDEX "Memorabilia_availability_idx" ON "Memorabilia"("availability");

-- CreateIndex
CREATE INDEX "Memorabilia_condition_idx" ON "Memorabilia"("condition");

-- CreateIndex
CREATE INDEX "Memorabilia_rarity_idx" ON "Memorabilia"("rarity");

-- CreateIndex
CREATE INDEX "Memorabilia_featured_idx" ON "Memorabilia"("featured");

-- CreateIndex
CREATE INDEX "Memorabilia_displayOrder_idx" ON "Memorabilia"("displayOrder");

-- CreateIndex
CREATE INDEX "Memorabilia_playerId_idx" ON "Memorabilia"("playerId");

-- CreateIndex
CREATE INDEX "Memorabilia_year_idx" ON "Memorabilia"("year");

-- CreateIndex
CREATE INDEX "Memorabilia_brand_idx" ON "Memorabilia"("brand");

-- CreateIndex
CREATE INDEX "Memorabilia_collection_idx" ON "Memorabilia"("collection");

-- CreateIndex
CREATE INDEX "Memorabilia_signed_idx" ON "Memorabilia"("signed");

-- CreateIndex
CREATE INDEX "Memorabilia_authentic_idx" ON "Memorabilia"("authentic");

-- CreateIndex
CREATE INDEX "Memorabilia_publishedAt_idx" ON "Memorabilia"("publishedAt");

-- CreateIndex
CREATE INDEX "Memorabilia_createdAt_idx" ON "Memorabilia"("createdAt");

-- CreateIndex
CREATE INDEX "MemorabiliaImage_memorabiliaId_idx" ON "MemorabiliaImage"("memorabiliaId");

-- CreateIndex
CREATE INDEX "MemorabiliaImage_sortOrder_idx" ON "MemorabiliaImage"("sortOrder");

-- CreateIndex
CREATE INDEX "MemorabiliaImage_isCover_idx" ON "MemorabiliaImage"("isCover");

-- CreateIndex
CREATE UNIQUE INDEX "Artifact_stripeProductId_key" ON "Artifact"("stripeProductId");

-- CreateIndex
CREATE UNIQUE INDEX "Artifact_stripePriceId_key" ON "Artifact"("stripePriceId");

-- CreateIndex
CREATE INDEX "OrderItem_artifactId_idx" ON "OrderItem"("artifactId");

-- CreateIndex
CREATE INDEX "OrderItem_memorabiliaId_idx" ON "OrderItem"("memorabiliaId");

-- CreateIndex
CREATE INDEX "OrderItem_originalProductId_idx" ON "OrderItem"("originalProductId");

-- CreateIndex
CREATE INDEX "OrderItem_itemType_idx" ON "OrderItem"("itemType");

-- AddForeignKey
ALTER TABLE "Memorabilia" ADD CONSTRAINT "Memorabilia_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemorabiliaImage" ADD CONSTRAINT "MemorabiliaImage_memorabiliaId_fkey" FOREIGN KEY ("memorabiliaId") REFERENCES "Memorabilia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "Artifact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_memorabiliaId_fkey" FOREIGN KEY ("memorabiliaId") REFERENCES "Memorabilia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_originalProductId_fkey" FOREIGN KEY ("originalProductId") REFERENCES "OriginalProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;
