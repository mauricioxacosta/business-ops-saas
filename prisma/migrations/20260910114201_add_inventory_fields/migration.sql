-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "cost" DECIMAL(65,30),
ADD COLUMN     "reorderLevel" INTEGER NOT NULL DEFAULT 5;
