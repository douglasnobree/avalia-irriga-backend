import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  proprietario: string;

  @IsString()
  @IsNotEmpty()
  telefone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  municipio: string;

  @IsString()
  @IsNotEmpty()
  estado: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  area_total: number;

  @IsNumber()
  area_irrigada: number;

  @IsString()
  @IsOptional()
  observacoes?: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  organizationId: string;
}
