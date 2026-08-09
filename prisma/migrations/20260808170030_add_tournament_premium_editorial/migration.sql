-- CreateTable
CREATE TABLE "TournamentGalleryItem" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "title" TEXT,
    "eyebrow" TEXT,
    "caption" TEXT,
    "imageUrl" TEXT NOT NULL,
    "alt" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TournamentGalleryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentMilestone" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "year" INTEGER,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TournamentMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentChapter" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "eyebrow" TEXT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,
    "yearLabel" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TournamentChapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentIconicMoment" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "year" INTEGER,
    "momentDate" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TournamentIconicMoment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TournamentGalleryItem_tournamentId_idx" ON "TournamentGalleryItem"("tournamentId");

-- CreateIndex
CREATE INDEX "TournamentGalleryItem_tournamentId_sortOrder_idx" ON "TournamentGalleryItem"("tournamentId", "sortOrder");

-- CreateIndex
CREATE INDEX "TournamentGalleryItem_featured_idx" ON "TournamentGalleryItem"("featured");

-- CreateIndex
CREATE INDEX "TournamentMilestone_tournamentId_idx" ON "TournamentMilestone"("tournamentId");

-- CreateIndex
CREATE INDEX "TournamentMilestone_tournamentId_year_idx" ON "TournamentMilestone"("tournamentId", "year");

-- CreateIndex
CREATE INDEX "TournamentMilestone_tournamentId_sortOrder_idx" ON "TournamentMilestone"("tournamentId", "sortOrder");

-- CreateIndex
CREATE INDEX "TournamentMilestone_featured_idx" ON "TournamentMilestone"("featured");

-- CreateIndex
CREATE INDEX "TournamentChapter_tournamentId_idx" ON "TournamentChapter"("tournamentId");

-- CreateIndex
CREATE INDEX "TournamentChapter_tournamentId_sortOrder_idx" ON "TournamentChapter"("tournamentId", "sortOrder");

-- CreateIndex
CREATE INDEX "TournamentChapter_featured_idx" ON "TournamentChapter"("featured");

-- CreateIndex
CREATE INDEX "TournamentIconicMoment_tournamentId_idx" ON "TournamentIconicMoment"("tournamentId");

-- CreateIndex
CREATE INDEX "TournamentIconicMoment_tournamentId_year_idx" ON "TournamentIconicMoment"("tournamentId", "year");

-- CreateIndex
CREATE INDEX "TournamentIconicMoment_tournamentId_sortOrder_idx" ON "TournamentIconicMoment"("tournamentId", "sortOrder");

-- CreateIndex
CREATE INDEX "TournamentIconicMoment_featured_idx" ON "TournamentIconicMoment"("featured");

-- AddForeignKey
ALTER TABLE "TournamentGalleryItem" ADD CONSTRAINT "TournamentGalleryItem_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentMilestone" ADD CONSTRAINT "TournamentMilestone_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentChapter" ADD CONSTRAINT "TournamentChapter_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentIconicMoment" ADD CONSTRAINT "TournamentIconicMoment_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;
