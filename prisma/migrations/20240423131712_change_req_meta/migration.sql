/*
  Warnings:

  - Added the required column `metaPropertyId` to the `ChangeRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChangeRequest" ADD COLUMN     "metaPropertyId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ChangeRequest" ADD CONSTRAINT "ChangeRequest_metaPropertyId_fkey" FOREIGN KEY ("metaPropertyId") REFERENCES "MetaProperty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
