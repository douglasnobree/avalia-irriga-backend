/*
  Warnings:

  - You are about to drop the column `userId` on the `Setor_Hidraulico` table. All the data in the column will be lost.
  - Added the required column `propriedadeId` to the `Pivo_Central` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propriedadeId` to the `Setor_Hidraulico` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Setor_Hidraulico` DROP FOREIGN KEY `Setor_Hidraulico_userId_fkey`;

-- DropIndex
DROP INDEX `Setor_Hidraulico_userId_fkey` ON `Setor_Hidraulico`;

-- AlterTable
ALTER TABLE `Pivo_Central` ADD COLUMN `propriedadeId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Setor_Hidraulico` DROP COLUMN `userId`,
    ADD COLUMN `propriedadeId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Setor_Hidraulico` ADD CONSTRAINT `Setor_Hidraulico_propriedadeId_fkey` FOREIGN KEY (`propriedadeId`) REFERENCES `Propriedade`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pivo_Central` ADD CONSTRAINT `Pivo_Central_propriedadeId_fkey` FOREIGN KEY (`propriedadeId`) REFERENCES `Propriedade`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
