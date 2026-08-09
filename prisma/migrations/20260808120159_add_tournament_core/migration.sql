-- CreateEnum
CREATE TYPE "TournamentCategory" AS ENUM ('GRAND_SLAM', 'ATP_FINALS', 'MASTERS_1000', 'ATP_500', 'ATP_250', 'OLYMPICS', 'DAVIS_CUP', 'OTHER');

-- CreateEnum
CREATE TYPE "CourtSurface" AS ENUM ('HARD', 'CLAY', 'GRASS', 'CARPET', 'INDOOR_HARD', 'OTHER');

-- CreateTable
CREATE TABLE "Tournament" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortName" TEXT,
    "category" "TournamentCategory" NOT NULL,
    "surface" "CourtSurface" NOT NULL,
    "city" TEXT,
    "country" TEXT NOT NULL,
    "countryCode" TEXT,
    "venue" TEXT,
    "foundedYear" INTEGER,
    "description" TEXT,
    "history" TEXT,
    "logoUrl" TEXT,
    "heroImage" TEXT,
    "websiteUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentEdition" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "drawSize" INTEGER,
    "championName" TEXT,
    "runnerUpName" TEXT,
    "championPlayerId" TEXT,
    "runnerUpPlayerId" TEXT,
    "championCountryCode" TEXT,
    "runnerUpCountryCode" TEXT,
    "score" TEXT,
    "cancelled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TournamentEdition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentChampion" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "titles" INTEGER NOT NULL DEFAULT 1,
    "firstTitleYear" INTEGER,
    "lastTitleYear" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TournamentChampion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_slug_key" ON "Tournament"("slug");

-- CreateIndex
CREATE INDEX "Tournament_name_idx" ON "Tournament"("name");

-- CreateIndex
CREATE INDEX "Tournament_category_idx" ON "Tournament"("category");

-- CreateIndex
CREATE INDEX "Tournament_surface_idx" ON "Tournament"("surface");

-- CreateIndex
CREATE INDEX "Tournament_country_idx" ON "Tournament"("country");

-- CreateIndex
CREATE INDEX "Tournament_active_idx" ON "Tournament"("active");

-- CreateIndex
CREATE INDEX "Tournament_featured_idx" ON "Tournament"("featured");

-- CreateIndex
CREATE INDEX "Tournament_displayOrder_idx" ON "Tournament"("displayOrder");

-- CreateIndex
CREATE INDEX "TournamentEdition_tournamentId_idx" ON "TournamentEdition"("tournamentId");

-- CreateIndex
CREATE INDEX "TournamentEdition_year_idx" ON "TournamentEdition"("year");

-- CreateIndex
CREATE INDEX "TournamentEdition_championPlayerId_idx" ON "TournamentEdition"("championPlayerId");

-- CreateIndex
CREATE INDEX "TournamentEdition_runnerUpPlayerId_idx" ON "TournamentEdition"("runnerUpPlayerId");

-- CreateIndex
CREATE INDEX "TournamentEdition_cancelled_idx" ON "TournamentEdition"("cancelled");

-- CreateIndex
CREATE UNIQUE INDEX "TournamentEdition_tournamentId_year_key" ON "TournamentEdition"("tournamentId", "year");

-- CreateIndex
CREATE INDEX "TournamentChampion_tournamentId_idx" ON "TournamentChampion"("tournamentId");

-- CreateIndex
CREATE INDEX "TournamentChampion_playerId_idx" ON "TournamentChampion"("playerId");

-- CreateIndex
CREATE INDEX "TournamentChampion_titles_idx" ON "TournamentChampion"("titles");

-- CreateIndex
CREATE UNIQUE INDEX "TournamentChampion_tournamentId_playerId_key" ON "TournamentChampion"("tournamentId", "playerId");

-- AddForeignKey
ALTER TABLE "TournamentEdition" ADD CONSTRAINT "TournamentEdition_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentEdition" ADD CONSTRAINT "TournamentEdition_championPlayerId_fkey" FOREIGN KEY ("championPlayerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentEdition" ADD CONSTRAINT "TournamentEdition_runnerUpPlayerId_fkey" FOREIGN KEY ("runnerUpPlayerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentChampion" ADD CONSTRAINT "TournamentChampion_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentChampion" ADD CONSTRAINT "TournamentChampion_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
