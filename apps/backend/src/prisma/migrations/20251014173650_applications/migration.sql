-- CreateTable
CREATE TABLE "Applications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "Phone" TEXT,
    "Description" TEXT,
    "Status" TEXT NOT NULL
);
