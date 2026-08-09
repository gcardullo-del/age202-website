-- AlterTable
ALTER TABLE "TournamentChampion" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "finals" INTEGER,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "legend" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "quote" TEXT,
ADD COLUMN     "recordLabel" TEXT,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "titleYears" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "wins" INTEGER;

-- CreateIndex
CREATE INDEX "TournamentChampion_legend_idx" ON "TournamentChampion"("legend");

-- CreateIndex
CREATE INDEX "TournamentChampion_featured_idx" ON "TournamentChampion"("featured");

-- CreateIndex
CREATE INDEX "TournamentChampion_sortOrder_idx" ON "TournamentChampion"("sortOrder");
