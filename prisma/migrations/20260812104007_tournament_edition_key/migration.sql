/*
  Warnings:

  - A unique constraint covering the columns `[tournamentId,year,editionKey]` on the table `TournamentEdition` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TournamentEdition_tournamentId_year_key";

-- AlterTable
ALTER TABLE "TournamentEdition" ADD COLUMN     "editionKey" TEXT NOT NULL DEFAULT 'main',
ADD COLUMN     "editionLabel" TEXT;

-- CreateIndex
CREATE INDEX "TournamentEdition_editionKey_idx" ON "TournamentEdition"("editionKey");

-- CreateIndex
CREATE UNIQUE INDEX "TournamentEdition_tournamentId_year_editionKey_key" ON "TournamentEdition"("tournamentId", "year", "editionKey");
