-- AlterTable
ALTER TABLE `setor_hidraulico` 
  DROP COLUMN `num_emissores`,
  DROP COLUMN `pressao_entrada`,
  DROP COLUMN `pressao_recomendada`,
  MODIFY `fabricante` VARCHAR(191) NULL,
  MODIFY `modelo` VARCHAR(191) NULL,
  MODIFY `condicoes_gerais` VARCHAR(191) NULL;
