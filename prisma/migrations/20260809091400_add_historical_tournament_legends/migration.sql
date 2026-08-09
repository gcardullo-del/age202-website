-- DropForeignKey
ALTER TABLE "TournamentChampion" DROP CONSTRAINT "TournamentChampion_playerId_fkey";

-- AlterTable
ALTER TABLE "TournamentChampion" ADD COLUMN     "country" TEXT,
ADD COLUMN     "countryCode" TEXT,
ADD COLUMN     "name" TEXT,
ALTER COLUMN "playerId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "TournamentChampion_name_idx" ON "TournamentChampion"("name");

-- AddForeignKey
ALTER TABLE "TournamentChampion" ADD CONSTRAINT "TournamentChampion_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
