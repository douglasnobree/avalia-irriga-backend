-- CreateTable
CREATE TABLE `Avaliador` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `emailVerified` DATETIME(3) NULL,
    `password` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Avaliador_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` VARCHAR(191) NULL,
    `access_token` VARCHAR(191) NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` VARCHAR(191) NULL,
    `session_state` VARCHAR(191) NULL,

    INDEX `Account_userId_idx`(`userId`),
    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Propriedade` (
    `nome` VARCHAR(191) NOT NULL,
    `proprietario` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `municipio` VARCHAR(191) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `area_total` DOUBLE NOT NULL,
    `area_irrigada` DOUBLE NOT NULL,
    `observacoes` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Propriedade_nome_key`(`nome`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Unidade_avaliada` (
    `id` VARCHAR(191) NOT NULL,
    `indentificacao` VARCHAR(191) NOT NULL,
    `area_ha` DOUBLE NOT NULL,
    `propriedade_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Avaliacao` (
    `id` VARCHAR(191) NOT NULL,
    `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `area_irrigada` DOUBLE NOT NULL,
    `volume_agua` DOUBLE NOT NULL,
    `tempo_irrigacao` DOUBLE NOT NULL,
    `cud` DOUBLE NOT NULL,
    `cuc` DOUBLE NOT NULL,
    `offline_status` BOOLEAN NOT NULL,
    `avaliador_id` VARCHAR(191) NOT NULL,
    `unidade_type` ENUM('SETOR_HIDRAULICO', 'PIVO_CENTRAL') NOT NULL,
    `unidade_id` VARCHAR(191) NOT NULL,
    `setor_id` VARCHAR(191) NULL,
    `pivo_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comentario` (
    `id` VARCHAR(191) NOT NULL,
    `comentario` VARCHAR(191) NOT NULL,
    `avaliacao_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Foto` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `comentario_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ponto_localizada` (
    `id` VARCHAR(191) NOT NULL,
    `eixo_x` DOUBLE NOT NULL,
    `eixo_y` DOUBLE NOT NULL,
    `volume_ml` DOUBLE NOT NULL,
    `tempo_seg` INTEGER NOT NULL,
    `vazao_l_h` DOUBLE NOT NULL,
    `avaliacao_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ponto_pivo` (
    `id` VARCHAR(191) NOT NULL,
    `sequencia` INTEGER NOT NULL,
    `distancia` DOUBLE NOT NULL,
    `diametro_coletor` DOUBLE NOT NULL,
    `volume_ml` DOUBLE NOT NULL,
    `tempo_seg` INTEGER NOT NULL,
    `vazao_l_h` DOUBLE NOT NULL,
    `avaliacao_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Setor_Hidraulico` (
    `id` VARCHAR(191) NOT NULL,
    `fabricante` VARCHAR(191) NOT NULL,
    `modelo` VARCHAR(191) NOT NULL,
    `vazao_nominal` DOUBLE NOT NULL,
    `pressao_trabalho` DOUBLE NOT NULL,
    `pressao_recomendada` DOUBLE NOT NULL,
    `dist_emissores` DOUBLE NOT NULL,
    `dist_laterais` DOUBLE NOT NULL,
    `filtro_tipo` VARCHAR(191) NOT NULL,
    `malha_filtro` VARCHAR(191) NOT NULL,
    `pressao_entrada` DOUBLE NOT NULL,
    `valvula_tipo` VARCHAR(191) NOT NULL,
    `energia_tipo` VARCHAR(191) NOT NULL,
    `condicoes_gerais` VARCHAR(191) NOT NULL,
    `num_emissores` INTEGER NOT NULL,
    `freq_manutencao` VARCHAR(191) NOT NULL,
    `data_ultima_manutencao` DATETIME(3) NOT NULL,
    `emissor_type` ENUM('MICROMICROASPERSOR', 'GOTEJAMENTO') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pivo_Central` (
    `id` VARCHAR(191) NOT NULL,
    `num_torres` INTEGER NOT NULL,
    `comprimento` DOUBLE NOT NULL,
    `fabricante` VARCHAR(191) NOT NULL,
    `modelo` VARCHAR(191) NOT NULL,
    `emissor_type` ENUM('MICROMICROASPERSOR', 'GOTEJAMENTO') NOT NULL,
    `energia_tipo` VARCHAR(191) NOT NULL,
    `potencia_motor` DOUBLE NOT NULL,
    `vazao_operacao` DOUBLE NOT NULL,
    `controle_tipo` VARCHAR(191) NOT NULL,
    `fertirrigacao` BOOLEAN NOT NULL,
    `fonte_hidrica` VARCHAR(191) NOT NULL,
    `tempo_funcionamento` DOUBLE NOT NULL,
    `velocidade` DOUBLE NOT NULL,
    `bocal_tipo` VARCHAR(191) NOT NULL,
    `pressao_bocal` DOUBLE NOT NULL,
    `data_ultima_manutencao` DATETIME(3) NOT NULL,
    `freq_manutencao` VARCHAR(191) NOT NULL,
    `problemas_observados` VARCHAR(191) NOT NULL,
    `data_ultima_avaliacoes` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Avaliador`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Propriedade` ADD CONSTRAINT `Propriedade_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Avaliador`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Unidade_avaliada` ADD CONSTRAINT `Unidade_avaliada_propriedade_id_fkey` FOREIGN KEY (`propriedade_id`) REFERENCES `Propriedade`(`nome`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Avaliacao` ADD CONSTRAINT `Avaliacao_pivo_id_fkey` FOREIGN KEY (`pivo_id`) REFERENCES `Pivo_Central`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Avaliacao` ADD CONSTRAINT `Avaliacao_setor_id_fkey` FOREIGN KEY (`setor_id`) REFERENCES `Setor_Hidraulico`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Avaliacao` ADD CONSTRAINT `Avaliacao_unidade_id_fkey` FOREIGN KEY (`unidade_id`) REFERENCES `Unidade_avaliada`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comentario` ADD CONSTRAINT `Comentario_avaliacao_id_fkey` FOREIGN KEY (`avaliacao_id`) REFERENCES `Avaliacao`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Foto` ADD CONSTRAINT `Foto_comentario_id_fkey` FOREIGN KEY (`comentario_id`) REFERENCES `Comentario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ponto_localizada` ADD CONSTRAINT `Ponto_localizada_avaliacao_id_fkey` FOREIGN KEY (`avaliacao_id`) REFERENCES `Avaliacao`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ponto_pivo` ADD CONSTRAINT `Ponto_pivo_avaliacao_id_fkey` FOREIGN KEY (`avaliacao_id`) REFERENCES `Avaliacao`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
