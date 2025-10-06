/*
  Warnings:

  - You are about to drop the `Unidade_avaliada` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Avaliacao` DROP FOREIGN KEY `Avaliacao_unidade_id_fkey`;

-- DropForeignKey
ALTER TABLE `Unidade_avaliada` DROP FOREIGN KEY `Unidade_avaliada_propriedade_id_fkey`;

-- DropIndex
DROP INDEX `Avaliacao_unidade_id_fkey` ON `Avaliacao`;

-- DropTable
DROP TABLE `Unidade_avaliada`;
