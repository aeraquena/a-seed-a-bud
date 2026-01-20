-- AlterTable
CREATE SEQUENCE plant_index_seq;
ALTER TABLE "Plant" ALTER COLUMN "index" SET DEFAULT nextval('plant_index_seq');
ALTER SEQUENCE plant_index_seq OWNED BY "Plant"."index";
