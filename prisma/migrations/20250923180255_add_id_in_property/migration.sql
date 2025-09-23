/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Propriedade` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Propriedade` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `unidade_avaliada` DROP FOREIGN KEY `Unidade_avaliada_propriedade_id_fkey`;

-- DropIndex
DROP INDEX `Propriedade_nome_key` ON `propriedade`;

-- DropIndex
DROP INDEX `Unidade_avaliada_propriedade_id_fkey` ON `unidade_avaliada`;

-- AlterTable
ALTER TABLE `propriedade` ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Propriedade_id_key` ON `Propriedade`(`id`);

-- AddForeignKey
ALTER TABLE `Unidade_avaliada` ADD CONSTRAINT `Unidade_avaliada_propriedade_id_fkey` FOREIGN KEY (`propriedade_id`) REFERENCES `Propriedade`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
