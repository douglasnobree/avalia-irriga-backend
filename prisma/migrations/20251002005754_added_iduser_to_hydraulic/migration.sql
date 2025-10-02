/*
  Warnings:

  - Added the required column `setor_id` to the `Ponto_localizada` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pivo_id` to the `Ponto_pivo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo_setor` to the `Setor_Hidraulico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Setor_Hidraulico` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Ponto_localizada` ADD COLUMN `setor_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Ponto_pivo` ADD COLUMN `pivo_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Setor_Hidraulico` ADD COLUMN `tipo_setor` ENUM('SETOR_HIDRAULICO', 'PIVO_CENTRAL') NOT NULL,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Ponto_localizada` ADD CONSTRAINT `Ponto_localizada_setor_id_fkey` FOREIGN KEY (`setor_id`) REFERENCES `Setor_Hidraulico`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Setor_Hidraulico` ADD CONSTRAINT `Setor_Hidraulico_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ponto_pivo` ADD CONSTRAINT `Ponto_pivo_pivo_id_fkey` FOREIGN KEY (`pivo_id`) REFERENCES `Pivo_Central`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
