/*
  Warnings:

  - Added the required column `organizationId` to the `Propriedade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Propriedade` ADD COLUMN `organizationId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Propriedade` ADD CONSTRAINT `Propriedade_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
