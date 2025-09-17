/*
  Warnings:

  - Made the column `password` on table `Avaliador` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Avaliador` ADD COLUMN `refreshToken` VARCHAR(191) NULL,
    MODIFY `password` VARCHAR(191) NOT NULL;
