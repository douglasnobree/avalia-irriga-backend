-- CreateTable
CREATE TABLE `account` (
    `id` VARCHAR(191) NOT NULL,
    `accountId` TEXT NOT NULL,
    `providerId` TEXT NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `accessToken` TEXT NULL,
    `refreshToken` TEXT NULL,
    `idToken` TEXT NULL,
    `accessTokenExpiresAt` DATETIME(3) NULL,
    `refreshTokenExpiresAt` DATETIME(3) NULL,
    `scope` TEXT NULL,
    `password` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Propriedade` (
    `id` VARCHAR(191) NOT NULL,
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
    `observacoes` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Propriedade_id_key`(`id`),
    PRIMARY KEY (`id`)
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
    `cue` DOUBLE NOT NULL DEFAULT 0,
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
    `setor_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Setor_Hidraulico` (
    `id` VARCHAR(191) NOT NULL,
    `identificacao` VARCHAR(191) NOT NULL,
    `fabricante` VARCHAR(191) NULL,
    `modelo` VARCHAR(191) NULL,
    `vazao_nominal` DOUBLE NOT NULL,
    `pressao_trabalho` DOUBLE NOT NULL,
    `dist_emissores` DOUBLE NOT NULL,
    `dist_laterais` DOUBLE NOT NULL,
    `filtro_tipo` VARCHAR(191) NOT NULL,
    `malha_filtro` VARCHAR(191) NOT NULL,
    `valvula_tipo` VARCHAR(191) NOT NULL,
    `energia_tipo` VARCHAR(191) NOT NULL,
    `condicoes_gerais` VARCHAR(191) NULL,
    `freq_manutencao` VARCHAR(191) NOT NULL,
    `data_ultima_manutencao` DATETIME(3) NOT NULL,
    `emissor_type` ENUM('MICROMICROASPERSOR', 'GOTEJAMENTO') NOT NULL,
    `tipo_setor` ENUM('SETOR_HIDRAULICO', 'PIVO_CENTRAL') NOT NULL,
    `propriedadeId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

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
    `pivo_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pivo_Central` (
    `id` VARCHAR(191) NOT NULL,
    `identificacao` VARCHAR(191) NOT NULL,
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
    `propriedadeId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `name` TEXT NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    `image` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `role` TEXT NULL,
    `banned` BOOLEAN NULL DEFAULT false,
    `banReason` TEXT NULL,
    `banExpires` DATETIME(3) NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session` (
    `id` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `ipAddress` TEXT NULL,
    `userAgent` TEXT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `impersonatedBy` TEXT NULL,
    `activeOrganizationId` TEXT NULL,

    UNIQUE INDEX `session_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verification` (
    `id` VARCHAR(191) NOT NULL,
    `identifier` TEXT NOT NULL,
    `value` TEXT NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `organization` (
    `id` VARCHAR(191) NOT NULL,
    `name` TEXT NOT NULL,
    `slug` VARCHAR(191) NULL,
    `logo` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `metadata` TEXT NULL,

    UNIQUE INDEX `organization_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member` (
    `id` VARCHAR(191) NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `role` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invitation` (
    `id` VARCHAR(191) NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `email` TEXT NOT NULL,
    `role` TEXT NULL,
    `status` TEXT NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `inviterId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Propriedade` ADD CONSTRAINT `Propriedade_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Propriedade` ADD CONSTRAINT `Propriedade_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Unidade_avaliada` ADD CONSTRAINT `Unidade_avaliada_propriedade_id_fkey` FOREIGN KEY (`propriedade_id`) REFERENCES `Propriedade`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE `Ponto_localizada` ADD CONSTRAINT `Ponto_localizada_setor_id_fkey` FOREIGN KEY (`setor_id`) REFERENCES `Setor_Hidraulico`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Setor_Hidraulico` ADD CONSTRAINT `Setor_Hidraulico_propriedadeId_fkey` FOREIGN KEY (`propriedadeId`) REFERENCES `Propriedade`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Setor_Hidraulico` ADD CONSTRAINT `Setor_Hidraulico_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ponto_pivo` ADD CONSTRAINT `Ponto_pivo_avaliacao_id_fkey` FOREIGN KEY (`avaliacao_id`) REFERENCES `Avaliacao`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ponto_pivo` ADD CONSTRAINT `Ponto_pivo_pivo_id_fkey` FOREIGN KEY (`pivo_id`) REFERENCES `Pivo_Central`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pivo_Central` ADD CONSTRAINT `Pivo_Central_propriedadeId_fkey` FOREIGN KEY (`propriedadeId`) REFERENCES `Propriedade`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pivo_Central` ADD CONSTRAINT `Pivo_Central_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `session` ADD CONSTRAINT `session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member` ADD CONSTRAINT `member_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member` ADD CONSTRAINT `member_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invitation` ADD CONSTRAINT `invitation_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invitation` ADD CONSTRAINT `invitation_inviterId_fkey` FOREIGN KEY (`inviterId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
