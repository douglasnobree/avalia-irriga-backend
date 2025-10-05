import { IsString, IsNumber, IsEnum, IsBoolean, IsOptional, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EmissorType, UnitModel } from '@prisma/client';

export class UnidadeAvaliadaDto {
  @IsString()
  indentificacao: string;

  @IsNumber()
  area_ha: number;

  @IsString()
  propriedade_id: string;
}

export class SetorHidraulicoDto {
  @IsString()
  @IsOptional()
  fabricante?: string;

  @IsString()
  @IsOptional()
  modelo?: string;

  @IsNumber()
  vazao_nominal: number;

  @IsNumber()
  pressao_trabalho: number;

  @IsNumber()
  dist_emissores: number;

  @IsNumber()
  dist_laterais: number;

  @IsString()
  filtro_tipo: string;

  @IsString()
  malha_filtro: string;

  @IsString()
  valvula_tipo: string;

  @IsString()
  energia_tipo: string;

  @IsString()
  @IsOptional()
  condicoes_gerais?: string;

  @IsString()
  freq_manutencao: string;

  @IsDateString()
  data_ultima_manutencao: string;

  @IsEnum(EmissorType)
  emissor_type: EmissorType;

  @IsEnum(UnitModel)
  tipo_setor: UnitModel;
}

export class PivoCentralDto {
  @IsNumber()
  num_torres: number;

  @IsNumber()
  comprimento: number;

  @IsString()
  @IsOptional()
  fabricante?: string;

  @IsString()
  @IsOptional()
  modelo?: string;

  @IsEnum(EmissorType)
  emissor_type: EmissorType;

  @IsString()
  energia_tipo: string;

  @IsNumber()
  potencia_motor: number;

  @IsNumber()
  vazao_operacao: number;

  @IsString()
  controle_tipo: string;

  @IsBoolean()
  fertirrigacao: boolean;

  @IsString()
  fonte_hidrica: string;

  @IsNumber()
  tempo_funcionamento: number;

  @IsNumber()
  velocidade: number;

  @IsString()
  bocal_tipo: string;

  @IsNumber()
  pressao_bocal: number;

  @IsDateString()
  data_ultima_manutencao: string;

  @IsString()
  freq_manutencao: string;

  @IsString()
  @IsOptional()
  problemas_observados?: string;

  @IsDateString()
  data_ultima_avaliacoes: string;
}

export class CreateAreaDto {
  @ValidateNested()
  @Type(() => UnidadeAvaliadaDto)
  area: UnidadeAvaliadaDto;

  @ValidateNested()
  @Type(() => SetorHidraulicoDto)
  @IsOptional()
  setor_hidraulico?: SetorHidraulicoDto;

  @ValidateNested()
  @Type(() => PivoCentralDto)
  @IsOptional()
  pivo_central?: PivoCentralDto;
}
