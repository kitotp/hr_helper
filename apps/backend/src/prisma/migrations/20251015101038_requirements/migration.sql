-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Requirements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "job" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "stack" TEXT NOT NULL
);
INSERT INTO "new_Requirements" ("company_name", "email", "experience", "id", "job", "stack") SELECT "company_name", "email", "experience", "id", "job", "stack" FROM "Requirements";
DROP TABLE "Requirements";
ALTER TABLE "new_Requirements" RENAME TO "Requirements";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
