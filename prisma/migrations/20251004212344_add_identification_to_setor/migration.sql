/*
  Warnings:

  - Added the required column `identificacao` to the `Pivo_Central` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identificacao` to the `Setor_Hidraulico` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Pivo_Central` ADD COLUMN `identificacao` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Setor_Hidraulico` ADD COLUMN `identificacao` VARCHAR(191) NOT NULL;
