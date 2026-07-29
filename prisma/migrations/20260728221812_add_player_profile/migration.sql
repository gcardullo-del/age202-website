-- CreateTable
CREATE TABLE "PlayerProfile" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "birthPlace" TEXT,
    "residence" TEXT,
    "height" INTEGER,
    "weight" INTEGER,
    "plays" TEXT,
    "backhand" TEXT,
    "coach" TEXT,
    "turnedPro" INTEGER,
    "careerHigh" INTEGER,
    "atpTitles" INTEGER NOT NULL DEFAULT 0,
    "australianOpen" INTEGER NOT NULL DEFAULT 0,
    "rolandGarros" INTEGER NOT NULL DEFAULT 0,
    "wimbledon" INTEGER NOT NULL DEFAULT 0,
    "usOpen" INTEGER NOT NULL DEFAULT 0,
    "grandSlams" INTEGER NOT NULL DEFAULT 0,
    "masters1000" INTEGER NOT NULL DEFAULT 0,
    "atpFinals" INTEGER NOT NULL DEFAULT 0,
    "olympicGold" INTEGER NOT NULL DEFAULT 0,
    "davisCup" INTEGER NOT NULL DEFAULT 0,
    "prizeMoney" DECIMAL(15,2),
    "playingStyle" TEXT,
    "favouriteSurface" TEXT,
    "biographyShort" TEXT,
    "biographyLong" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerProfile_playerId_key" ON "PlayerProfile"("playerId");

-- AddForeignKey
ALTER TABLE "PlayerProfile" ADD CONSTRAINT "PlayerProfile_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
