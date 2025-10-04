/*
  Warnings:

  - Added the required column `userId` to the `Pivo_Central` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Setor_Hidraulico` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Pivo_Central` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Setor_Hidraulico` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Setor_Hidraulico` ADD CONSTRAINT `Setor_Hidraulico_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pivo_Central` ADD CONSTRAINT `Pivo_Central_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
