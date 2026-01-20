/*
  Warnings:

  - Made the column `index` on table `Plant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Plant" ALTER COLUMN "index" SET NOT NULL;
