import {
  IsNumber,
  IsString,
  IsBoolean,
  IsEnum,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UnitModel } from '@prisma/client';

export class PontoMedicaoDto {
  @IsNumber()
  sequencia: number;

  @IsNumber()
  @IsOptional()
  eixo_x?: number;

  @IsNumber()
  @IsOptional()
  eixo_y?: number;

  @IsNumber()
  @IsOptional()
  distancia?: number;

  @IsNumber()
  diametro_coletor: number;

  @IsNumber()
  volume_ml: number;

  @IsNumber()
  tempo_seg: number;

  @IsNumber()
  vazao_l_h: number;
}

export class CreateAvaliacaoDto {
  @IsString()
  unidade_id: string;

  @IsNumber()
  area_irrigada: number;

  @IsNumber()
  volume_agua: number;

  @IsNumber()
  tempo_irrigacao: number;

  @IsNumber()
  cud: number;

  @IsNumber()
  cuc: number;

  @IsBoolean()
  offline_status: boolean;

  @IsEnum(UnitModel)
  unidade_type: UnitModel;

  @IsString()
  @IsOptional()
  setor_id?: string;

  @IsString()
  @IsOptional()
  pivo_id?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PontoMedicaoDto)
  pontos: PontoMedicaoDto[];

  @IsString()
  @IsOptional()
  comentarios?: string;

  @IsString()
  @IsOptional()
  recomendacoes?: string;
}
