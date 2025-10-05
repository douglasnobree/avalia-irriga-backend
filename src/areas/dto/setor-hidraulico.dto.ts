import { EmissorType, UnitModel } from '@prisma/client';
import { AvaliacaoSummaryDto } from './avaliacao-summary.dto';
import { UserSummaryDto } from './user-summary.dto';

export class SetorHidraulicoDto {
  id: string;
  identificacao: string;
  fabricante?: string | null;
  modelo?: string | null;
  vazao_nominal: number;
  pressao_trabalho: number;
  dist_emissores: number;
  dist_laterais: number;
  filtro_tipo: string;
  malha_filtro: string;
  valvula_tipo: string;
  energia_tipo: string;
  condicoes_gerais?: string | null;
  freq_manutencao: string;
  data_ultima_manutencao: Date;
  emissor_type: EmissorType;
  tipo_setor: UnitModel;
  user: UserSummaryDto;
  ultimasAvaliacoes: AvaliacaoSummaryDto[];
  totalAvaliacoes: number;
  totalPontos: number;
}
