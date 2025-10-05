import { IsUUID, IsNotEmpty } from 'class-validator';

export class FindAreasDto {
  @IsUUID()
  @IsNotEmpty()
  propriedadeId: string;
}
