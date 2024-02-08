/*
  Warnings:

  - You are about to drop the column `huggingFaceUrl` on the `LLM` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "LLM_huggingFaceUrl_key";

-- AlterTable
ALTER TABLE "LLM" DROP COLUMN "huggingFaceUrl";
