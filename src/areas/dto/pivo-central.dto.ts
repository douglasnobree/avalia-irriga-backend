import { EmissorType } from '@prisma/client';
import { AvaliacaoSummaryDto } from './avaliacao-summary.dto';
import { UserSummaryDto } from './user-summary.dto';

export class PivoCentralDto {
  id: string;
  identificacao: string;
  num_torres: number;
  comprimento: number;
  fabricante: string;
  modelo: string;
  emissor_type: EmissorType;
  energia_tipo: string;
  potencia_motor: number;
  vazao_operacao: number;
  controle_tipo: string;
  fertirrigacao: boolean;
  fonte_hidrica: string;
  tempo_funcionamento: number;
  velocidade: number;
  bocal_tipo: string;
  pressao_bocal: number;
  data_ultima_manutencao: Date;
  freq_manutencao: string;
  problemas_observados: string;
  data_ultima_avaliacoes: Date;
  user: UserSummaryDto;
  ultimasAvaliacoes: AvaliacaoSummaryDto[];
  totalAvaliacoes: number;
  totalPontos: number;
}
