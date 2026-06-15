-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Occurrence" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "location" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "source" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Occurrence" ("createdAt", "description", "id", "image", "location", "source", "status", "title") SELECT "createdAt", "description", "id", "image", "location", "source", "status", "title" FROM "Occurrence";
DROP TABLE "Occurrence";
ALTER TABLE "new_Occurrence" RENAME TO "Occurrence";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
