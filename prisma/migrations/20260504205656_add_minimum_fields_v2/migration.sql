-- CreateEnum
CREATE TYPE "PotMaterial" AS ENUM ('PLASTIC', 'CERAMIC', 'TERRACOTTA', 'GLASS', 'OTHER');

-- CreateEnum
CREATE TYPE "Substrate" AS ENUM ('SOIL', 'SOIL_WITH_DRAINAGE', 'SPHAGNUM_MOSS', 'WATER');

-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'REPOT';

-- AlterTable
ALTER TABLE "Plant" ADD COLUMN     "alive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "cost" INTEGER,
ADD COLUMN     "dateAcquired" TIMESTAMP(3),
ADD COLUMN     "potMaterial" "PotMaterial",
ADD COLUMN     "potSize" INTEGER,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "substrate" "Substrate";
