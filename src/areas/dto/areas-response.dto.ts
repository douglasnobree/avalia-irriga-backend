import { SetorHidraulicoDto } from './setor-hidraulico.dto';
import { PivoCentralDto } from './pivo-central.dto';

export class AreasResponseDto {
  propriedadeId: string;
  propriedadeNome: string;
  setores_hidraulicos: SetorHidraulicoDto[];
  pivo_centrais: PivoCentralDto[];
  totalSetores: number;
  totalPivos: number;
  totalAreas: number;
}
