-- AlterTable
ALTER TABLE "Plant" ALTER COLUMN "index" DROP NOT NULL,
ALTER COLUMN "index" DROP DEFAULT;
DROP SEQUENCE "plant_index_seq";
