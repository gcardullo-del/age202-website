-- CreateEnum
CREATE TYPE "PlayerEquipmentCategory" AS ENUM ('RACQUET', 'STRINGS', 'SHOES', 'APPAREL', 'BAG', 'ACCESSORY', 'OTHER');

-- CreateTable
CREATE TABLE "PlayerEquipment" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "category" "PlayerEquipmentCategory" NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "period" TEXT,
    "description" TEXT,
    "curiosity" TEXT,
    "imageUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerEquipment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlayerEquipment_playerId_idx" ON "PlayerEquipment"("playerId");

-- CreateIndex
CREATE INDEX "PlayerEquipment_category_idx" ON "PlayerEquipment"("category");

-- CreateIndex
CREATE INDEX "PlayerEquipment_featured_idx" ON "PlayerEquipment"("featured");

-- CreateIndex
CREATE INDEX "PlayerEquipment_sortOrder_idx" ON "PlayerEquipment"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerEquipment_playerId_category_name_key" ON "PlayerEquipment"("playerId", "category", "name");

-- AddForeignKey
ALTER TABLE "PlayerEquipment" ADD CONSTRAINT "PlayerEquipment_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
