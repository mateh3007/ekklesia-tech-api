-- CreateTable
CREATE TABLE "ChurchServiceRecord" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "serviceId" TEXT,
    "preacher" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "bibleVerse" TEXT,
    "notes" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ChurchServiceRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChurchServiceRecord" ADD CONSTRAINT "ChurchServiceRecord_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChurchServiceRecord" ADD CONSTRAINT "ChurchServiceRecord_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "ChurchService"("id") ON DELETE SET NULL ON UPDATE CASCADE;
