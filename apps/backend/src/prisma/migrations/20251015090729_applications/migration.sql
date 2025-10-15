/*
  Warnings:

  - You are about to drop the column `Description` on the `Applications` table. All the data in the column will be lost.
  - You are about to drop the column `Phone` on the `Applications` table. All the data in the column will be lost.
  - You are about to drop the column `Status` on the `Applications` table. All the data in the column will be lost.
  - Added the required column `status` to the `Applications` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Applications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "phone" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL
);
INSERT INTO "new_Applications" ("age", "created_at", "email", "id", "name") SELECT "age", "created_at", "email", "id", "name" FROM "Applications";
DROP TABLE "Applications";
ALTER TABLE "new_Applications" RENAME TO "Applications";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
