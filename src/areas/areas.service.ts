import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { AreasResponseDto, SetorHidraulicoDto, PivoCentralDto } from './dto';

@Injectable()
export class AreasService {
  constructor(private prisma: PrismaService) {}

  async findAll(propriedadeId: string): Promise<AreasResponseDto> {
    try {
      // Verificar se a propriedade existe
      const propriedade = await this.prisma.propriedade.findUnique({
        where: { id: propriedadeId },
      });

      if (!propriedade) {
        throw new NotFoundException(
          `Propriedade com ID ${propriedadeId} não encontrada`,
        );
      }

      // Buscar setores hidráulicos com dados relacionados
      const setores_hidraulicos = await this.prisma.setor_Hidraulico.findMany({
        where: {
          propriedadeId: propriedadeId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          avaliacoes: {
            select: {
              id: true,
              data: true,
              cud: true,
              cuc: true,
              cue: true,
            },
            orderBy: {
              data: 'desc',
            },
            take: 5, // Últimas 5 avaliações
          },
          _count: {
            select: {
              avaliacoes: true,
              pontos_localizada: true,
            },
          },
        },
      });
      console.log(setores_hidraulicos);
      // Buscar pivôs centrais com dados relacionados
      const pivo_centrais = await this.prisma.pivo_Central.findMany({
        where: {
          propriedadeId: propriedadeId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          avaliacoes: {
            select: {
              id: true,
              data: true,
              cud: true,
              cuc: true,
              cue: true,
            },
            orderBy: {
              data: 'desc',
            },
            take: 5, // Últimas 5 avaliações
          },
          _count: {
            select: {
              avaliacoes: true,
              pontos_pivo: true,
            },
          },
        },
      });

      // Mapear para DTOs
      const setoresDto: SetorHidraulicoDto[] = setores_hidraulicos.map(
        (setor) => ({
          id: setor.id,
          identificacao: setor.identificacao,
          fabricante: setor.fabricante,
          modelo: setor.modelo,
          vazao_nominal: setor.vazao_nominal,
          pressao_trabalho: setor.pressao_trabalho,
          dist_emissores: setor.dist_emissores,
          dist_laterais: setor.dist_laterais,
          filtro_tipo: setor.filtro_tipo,
          malha_filtro: setor.malha_filtro,
          valvula_tipo: setor.valvula_tipo,
          energia_tipo: setor.energia_tipo,
          condicoes_gerais: setor.condicoes_gerais,
          freq_manutencao: setor.freq_manutencao,
          data_ultima_manutencao: setor.data_ultima_manutencao,
          emissor_type: setor.emissor_type,
          tipo_setor: setor.tipo_setor,
          user: setor.user,
          ultimasAvaliacoes: setor.avaliacoes,
          totalAvaliacoes: setor._count.avaliacoes,
          totalPontos: setor._count.pontos_localizada,
        }),
      );

      const pivosDto: PivoCentralDto[] = pivo_centrais.map((pivo) => ({
        id: pivo.id,
        identificacao: pivo.identificacao,
        num_torres: pivo.num_torres,
        comprimento: pivo.comprimento,
        fabricante: pivo.fabricante,
        modelo: pivo.modelo,
        emissor_type: pivo.emissor_type,
        energia_tipo: pivo.energia_tipo,
        potencia_motor: pivo.potencia_motor,
        vazao_operacao: pivo.vazao_operacao,
        controle_tipo: pivo.controle_tipo,
        fertirrigacao: pivo.fertirrigacao,
        fonte_hidrica: pivo.fonte_hidrica,
        tempo_funcionamento: pivo.tempo_funcionamento,
        velocidade: pivo.velocidade,
        bocal_tipo: pivo.bocal_tipo,
        pressao_bocal: pivo.pressao_bocal,
        data_ultima_manutencao: pivo.data_ultima_manutencao,
        freq_manutencao: pivo.freq_manutencao,
        problemas_observados: pivo.problemas_observados,
        data_ultima_avaliacoes: pivo.data_ultima_avaliacoes,
        user: pivo.user,
        ultimasAvaliacoes: pivo.avaliacoes,
        totalAvaliacoes: pivo._count.avaliacoes,
        totalPontos: pivo._count.pontos_pivo,
      }));

      return {
        propriedadeId,
        propriedadeNome: propriedade.nome,
        setores_hidraulicos: setoresDto,
        pivo_centrais: pivosDto,
        totalSetores: setoresDto.length,
        totalPivos: pivosDto.length,
        totalAreas: setoresDto.length + pivosDto.length,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      // Em caso de erro, retornar estrutura vazia mas válida
      return {
        propriedadeId,
        propriedadeNome: 'Propriedade não encontrada',
        setores_hidraulicos: [],
        pivo_centrais: [],
        totalSetores: 0,
        totalPivos: 0,
        totalAreas: 0,
      };
    }
  }

  async findOne(areaId: string) {
    // Primeiro tenta buscar como setor hidráulico
    const setor = await this.prisma.setor_Hidraulico.findUnique({
      where: { id: areaId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        propriedade: true,
        avaliacoes: {
          orderBy: {
            data: 'desc',
          },
        },
      },
    });

    if (setor) {
      return {
        type: 'SETOR_HIDRAULICO',
        ...setor,
      };
    }

    // Se não encontrar, tenta buscar como pivô central
    const pivo = await this.prisma.pivo_Central.findUnique({
      where: { id: areaId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        propriedade: true,
        avaliacoes: {
          orderBy: {
            data: 'desc',
          },
        },
      },
    });

    if (pivo) {
      return {
        type: 'PIVO_CENTRAL',
        ...pivo,
      };
    }

    throw new NotFoundException(`Área com ID ${areaId} não encontrada`);
  }
}
