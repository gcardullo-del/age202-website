-- CreateEnum
CREATE TYPE "PlayerCollectionType" AS ENUM ('FEATURED', 'LEGEND', 'RISING_STAR', 'ARCHIVE');

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "accent" TEXT NOT NULL DEFAULT '#C8FF00',
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "collectionType" "PlayerCollectionType" NOT NULL DEFAULT 'ARCHIVE',
ADD COLUMN     "debutYear" INTEGER,
ADD COLUMN     "displayOrder" INTEGER,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "nickname" TEXT,
ADD COLUMN     "quote" TEXT;

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified" BOOLEAN NOT NULL DEFAULT true,
    "curator" TEXT,
    "notes" TEXT,
    "qrCodeUrl" TEXT,
    "artifactId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AtpPlayer" (
    "id" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "previousRank" INTEGER,
    "name" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "slug" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "age" INTEGER,
    "imageUrl" TEXT,
    "playerId" TEXT,
    "rankingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL DEFAULT 'AGE202',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AtpPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_code_key" ON "Certificate"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_artifactId_key" ON "Certificate"("artifactId");

-- CreateIndex
CREATE INDEX "Certificate_issuedAt_idx" ON "Certificate"("issuedAt");

-- CreateIndex
CREATE INDEX "Certificate_verified_idx" ON "Certificate"("verified");

-- CreateIndex
CREATE INDEX "Certificate_createdAt_idx" ON "Certificate"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AtpPlayer_slug_key" ON "AtpPlayer"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "AtpPlayer_playerId_key" ON "AtpPlayer"("playerId");

-- CreateIndex
CREATE INDEX "AtpPlayer_rank_idx" ON "AtpPlayer"("rank");

-- CreateIndex
CREATE INDEX "AtpPlayer_previousRank_idx" ON "AtpPlayer"("previousRank");

-- CreateIndex
CREATE INDEX "AtpPlayer_name_idx" ON "AtpPlayer"("name");

-- CreateIndex
CREATE INDEX "AtpPlayer_countryCode_idx" ON "AtpPlayer"("countryCode");

-- CreateIndex
CREATE INDEX "AtpPlayer_points_idx" ON "AtpPlayer"("points");

-- CreateIndex
CREATE INDEX "AtpPlayer_active_idx" ON "AtpPlayer"("active");

-- CreateIndex
CREATE INDEX "AtpPlayer_rankingDate_idx" ON "AtpPlayer"("rankingDate");

-- CreateIndex
CREATE INDEX "Player_collectionType_idx" ON "Player"("collectionType");

-- CreateIndex
CREATE INDEX "Player_displayOrder_idx" ON "Player"("displayOrder");

-- CreateIndex
CREATE INDEX "Player_active_idx" ON "Player"("active");

-- CreateIndex
CREATE INDEX "Player_debutYear_idx" ON "Player"("debutYear");

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "Artifact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtpPlayer" ADD CONSTRAINT "AtpPlayer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
