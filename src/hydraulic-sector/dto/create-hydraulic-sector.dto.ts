import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

// Enumeração para tipo de emissor, corresponde ao model do Prisma
export enum EmissorType {
  MICROMICROASPERSOR = 'MICROMICROASPERSOR',
  GOTEJAMENTO = 'GOTEJAMENTO',
}

import { UnitModel } from '@prisma/client';

export class CreateHydraulicSectorDto {
  @ApiProperty({
    description: 'ID do usuário proprietário do setor hidráulico',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty({ message: 'O userId é obrigatório' })
  @IsString({ message: 'O userId deve ser uma string' })
  userId: string;



  @ApiProperty({
    description: 'Nome do fabricante do setor hidráulico',
    example: 'Irrigação Tech',
    required: false,
  })
  @IsString({ message: 'O fabricante deve ser uma string' })
  fabricante?: string;

  @ApiProperty({
    description: 'Modelo do setor hidráulico',
    example: 'Modelo XYZ-2000',
    required: false,
  })
  @IsString({ message: 'O modelo deve ser uma string' })
  modelo?: string;

  @ApiProperty({
    description: 'Vazão nominal do sistema em m³/h',
    example: 10.5,
  })
  @IsNotEmpty({ message: 'A vazão nominal é obrigatória' })
  @IsNumber({}, { message: 'A vazão nominal deve ser um número' })
  @IsPositive({ message: 'A vazão nominal deve ser positiva' })
  vazao_nominal: number;

  @ApiProperty({
    description: 'Pressão de trabalho em kgf/cm²',
    example: 3.5,
  })
  @IsNotEmpty({ message: 'A pressão de trabalho é obrigatória' })
  @IsNumber({}, { message: 'A pressão de trabalho deve ser um número' })
  @IsPositive({ message: 'A pressão de trabalho deve ser positiva' })
  pressao_trabalho: number;

  @ApiProperty({
    description: 'Distância entre emissores em metros',
    example: 0.5,
  })
  @IsNotEmpty({ message: 'A distância entre emissores é obrigatória' })
  @IsNumber({}, { message: 'A distância entre emissores deve ser um número' })
  @IsPositive({ message: 'A distância entre emissores deve ser positiva' })
  dist_emissores: number;

  @ApiProperty({
    description: 'Distância entre laterais em metros',
    example: 2.0,
  })
  @IsNotEmpty({ message: 'A distância entre laterais é obrigatória' })
  @IsNumber({}, { message: 'A distância entre laterais deve ser um número' })
  @IsPositive({ message: 'A distância entre laterais deve ser positiva' })
  dist_laterais: number;

  @ApiProperty({
    description: 'Tipo de filtro utilizado',
    example: 'Disco',
  })
  @IsNotEmpty({ message: 'O tipo de filtro é obrigatório' })
  @IsString({ message: 'O tipo de filtro deve ser uma string' })
  filtro_tipo: string;

  @ApiProperty({
    description: 'Malha do filtro utilizado (medida em mesh)',
    example: '120 mesh',
  })
  @IsNotEmpty({ message: 'A malha do filtro é obrigatória' })
  @IsString({ message: 'A malha do filtro deve ser uma string' })
  malha_filtro: string;

  @ApiProperty({
    description: 'Tipo de válvula utilizada',
    example: 'Automática',
  })
  @IsNotEmpty({ message: 'O tipo de válvula é obrigatório' })
  @IsString({ message: 'O tipo de válvula deve ser uma string' })
  valvula_tipo: string;

  @ApiProperty({
    description: 'Tipo de energia utilizada',
    example: 'Elétrica',
  })
  @IsNotEmpty({ message: 'O tipo de energia é obrigatório' })
  @IsString({ message: 'O tipo de energia deve ser uma string' })
  energia_tipo: string;

  @ApiProperty({
    description: 'Condições gerais do sistema',
    example: 'Boas condições',
    required: false,
  })
  @IsString({ message: 'As condições gerais devem ser uma string' })
  condicoes_gerais?: string;

  @ApiProperty({
    description: 'Frequência de manutenção',
    example: 'Mensal',
  })
  @IsNotEmpty({ message: 'A frequência de manutenção é obrigatória' })
  @IsString({ message: 'A frequência de manutenção deve ser uma string' })
  freq_manutencao: string;

  @ApiProperty({
    description: 'Data da última manutenção',
    example: '2025-09-20T10:00:00Z',
  })
  @IsNotEmpty({ message: 'A data da última manutenção é obrigatória' })
  @Type(() => Date)
  @IsDate({ message: 'A data da última manutenção deve ser uma data válida' })
  data_ultima_manutencao: Date;

  @ApiProperty({
    description: 'Tipo de emissor utilizado',
    enum: EmissorType,
    example: EmissorType.GOTEJAMENTO,
  })
  @IsNotEmpty({ message: 'O tipo de emissor é obrigatório' })
  @IsEnum(EmissorType, {
    message: 'O tipo de emissor deve ser MICROMICROASPERSOR ou GOTEJAMENTO',
  })
  emissor_type: EmissorType;
}
