-- CreateTable
CREATE TABLE "ArtifactImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "artifactId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArtifactImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ArtifactImage_artifactId_idx" ON "ArtifactImage"("artifactId");

-- CreateIndex
CREATE INDEX "ArtifactImage_sortOrder_idx" ON "ArtifactImage"("sortOrder");

-- CreateIndex
CREATE INDEX "ArtifactImage_isCover_idx" ON "ArtifactImage"("isCover");

-- AddForeignKey
ALTER TABLE "ArtifactImage" ADD CONSTRAINT "ArtifactImage_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "Artifact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
