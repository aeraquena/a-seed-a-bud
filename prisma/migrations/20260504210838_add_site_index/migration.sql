/*
  Warnings:

  - Added the required column `index` to the `Site` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "index" INTEGER NOT NULL;
