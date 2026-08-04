-- CreateEnum
CREATE TYPE "OriginalProductStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "OriginalProductAvailability" AS ENUM ('AVAILABLE', 'SOLD', 'COMING_SOON', 'NOT_FOR_SALE');

-- CreateEnum
CREATE TYPE "OriginalProductCategory" AS ENUM ('TSHIRT', 'POLO', 'HOODIE', 'SWEATSHIRT', 'CAP', 'BOTTLE', 'BAG', 'POSTER', 'ACCESSORY', 'OTHER');

-- CreateTable
CREATE TABLE "OriginalProduct" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "collection" TEXT,
    "edition" TEXT,
    "category" "OriginalProductCategory" NOT NULL,
    "material" TEXT,
    "colour" TEXT,
    "sizes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "price" DECIMAL(10,2),
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "vintedUrl" TEXT,
    "availability" "OriginalProductAvailability" NOT NULL DEFAULT 'COMING_SOON',
    "status" "OriginalProductStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OriginalProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OriginalProductImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "originalProductId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OriginalProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OriginalProduct_slug_key" ON "OriginalProduct"("slug");

-- CreateIndex
CREATE INDEX "OriginalProduct_category_idx" ON "OriginalProduct"("category");

-- CreateIndex
CREATE INDEX "OriginalProduct_availability_idx" ON "OriginalProduct"("availability");

-- CreateIndex
CREATE INDEX "OriginalProduct_status_idx" ON "OriginalProduct"("status");

-- CreateIndex
CREATE INDEX "OriginalProduct_featured_idx" ON "OriginalProduct"("featured");

-- CreateIndex
CREATE INDEX "OriginalProduct_displayOrder_idx" ON "OriginalProduct"("displayOrder");

-- CreateIndex
CREATE INDEX "OriginalProduct_publishedAt_idx" ON "OriginalProduct"("publishedAt");

-- CreateIndex
CREATE INDEX "OriginalProduct_collection_idx" ON "OriginalProduct"("collection");

-- CreateIndex
CREATE INDEX "OriginalProduct_createdAt_idx" ON "OriginalProduct"("createdAt");

-- CreateIndex
CREATE INDEX "OriginalProductImage_originalProductId_idx" ON "OriginalProductImage"("originalProductId");

-- CreateIndex
CREATE INDEX "OriginalProductImage_sortOrder_idx" ON "OriginalProductImage"("sortOrder");

-- CreateIndex
CREATE INDEX "OriginalProductImage_isCover_idx" ON "OriginalProductImage"("isCover");

-- CreateIndex
CREATE INDEX "AtpPlayer_rank_active_idx" ON "AtpPlayer"("rank", "active");

-- AddForeignKey
ALTER TABLE "OriginalProductImage" ADD CONSTRAINT "OriginalProductImage_originalProductId_fkey" FOREIGN KEY ("originalProductId") REFERENCES "OriginalProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
