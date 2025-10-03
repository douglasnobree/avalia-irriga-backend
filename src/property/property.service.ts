import { Injectable, BadRequestException } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { CreateAreaDto } from './dto/create-area.dto';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class PropertyService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePropertyDto) {
    const property = await this.prisma.propriedade.create({
      // @ts-ignore
      data,
    });
    return property;
  }

  async findAll() {
    const property = await this.prisma.propriedade.findMany({
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
      },
    });
    return property;
  }

  async findOne(id: string) {
    const property = await this.prisma.propriedade.findUnique({
      where: { id: id },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
      },
    });
    return property;
  }

  async findByOrganization(organizationId: string) {
    const properties = await this.prisma.propriedade.findMany({
      where: { organizationId },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
      },
    });
    return properties;
  }

  async findByUserId(userId: string) {
    const properties = await this.prisma.propriedade.findMany({
      where: { userId },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
      },
    });
    return properties;
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto) {
    const property = await this.prisma.propriedade.findUnique({
      where: { id: id },
    });

    if (!property) {
      throw new Error('Propriedade não encontrada');
    }

    const { userId, ...updateData } = updatePropertyDto;
    return this.prisma.propriedade.update({
      where: { id: id },
      data: updateData,
    });
  }

  async remove(id: string) {
    const property = await this.prisma.propriedade.findUnique({
      where: { id: id },
    });

    if (!property) {
      throw new Error('Propriedade não encontrada');
    }

    return this.prisma.propriedade.delete({
      where: { id: id },
    });
  }

  async createArea(dto: CreateAreaDto, userId: string) {
    try {
      // Verificar se a propriedade existe
      const propriedade = await this.prisma.propriedade.findUnique({
        where: { id: dto.area.propriedade_id },
      });

      if (!propriedade) {
        throw new BadRequestException('Propriedade não encontrada');
      }

      // Usar transação para garantir atomicidade
      return await this.prisma.$transaction(async (tx) => {
        // 1. Criar a Unidade_avaliada
        const unidadeAvaliada = await tx.unidade_avaliada.create({
          data: {
            indentificacao: dto.area.indentificacao,
            area_ha: dto.area.area_ha,
            propriedade_id: dto.area.propriedade_id,
          },
        });

        // 2. Criar o Setor Hidráulico (se fornecido)
        if (dto.setor_hidraulico) {
          await tx.setor_Hidraulico.create({
            data: {
              fabricante: dto.setor_hidraulico.fabricante,
              modelo: dto.setor_hidraulico.modelo,
              vazao_nominal: dto.setor_hidraulico.vazao_nominal,
              pressao_trabalho: dto.setor_hidraulico.pressao_trabalho,
              pressao_recomendada: dto.setor_hidraulico.pressao_recomendada,
              dist_emissores: dto.setor_hidraulico.dist_emissores,
              dist_laterais: dto.setor_hidraulico.dist_laterais,
              filtro_tipo: dto.setor_hidraulico.filtro_tipo,
              malha_filtro: dto.setor_hidraulico.malha_filtro,
              pressao_entrada: dto.setor_hidraulico.pressao_entrada,
              valvula_tipo: dto.setor_hidraulico.valvula_tipo,
              energia_tipo: dto.setor_hidraulico.energia_tipo,
              condicoes_gerais: dto.setor_hidraulico.condicoes_gerais,
              num_emissores: dto.setor_hidraulico.num_emissores,
              freq_manutencao: dto.setor_hidraulico.freq_manutencao,
              data_ultima_manutencao: new Date(dto.setor_hidraulico.data_ultima_manutencao),
              emissor_type: dto.setor_hidraulico.emissor_type,
              tipo_setor: dto.setor_hidraulico.tipo_setor,
              userId,
            },
          });
        }

        // 3. Criar o Pivô Central (se fornecido)
        if (dto.pivo_central) {
          await tx.pivo_Central.create({
            data: {
              num_torres: dto.pivo_central.num_torres,
              comprimento: dto.pivo_central.comprimento,
              fabricante: dto.pivo_central.fabricante,
              modelo: dto.pivo_central.modelo,
              emissor_type: dto.pivo_central.emissor_type,
              energia_tipo: dto.pivo_central.energia_tipo,
              potencia_motor: dto.pivo_central.potencia_motor,
              vazao_operacao: dto.pivo_central.vazao_operacao,
              controle_tipo: dto.pivo_central.controle_tipo,
              fertirrigacao: dto.pivo_central.fertirrigacao,
              fonte_hidrica: dto.pivo_central.fonte_hidrica,
              tempo_funcionamento: dto.pivo_central.tempo_funcionamento,
              velocidade: dto.pivo_central.velocidade,
              bocal_tipo: dto.pivo_central.bocal_tipo,
              pressao_bocal: dto.pivo_central.pressao_bocal,
              data_ultima_manutencao: new Date(dto.pivo_central.data_ultima_manutencao),
              freq_manutencao: dto.pivo_central.freq_manutencao,
              problemas_observados: dto.pivo_central.problemas_observados || '',
              data_ultima_avaliacoes: new Date(dto.pivo_central.data_ultima_avaliacoes),
            },
          });
        }

        return {
          success: true,
          message: 'Área criada com sucesso',
          data: {
            id: unidadeAvaliada.id,
            indentificacao: unidadeAvaliada.indentificacao,
          },
        };
      });
    } catch (error) {
      console.error('Erro ao criar área:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao criar área: ' + error.message);
    }
  }

  async getAreasByProperty(propertyId: string) {
    try {
      const areas = await this.prisma.unidade_avaliada.findMany({
        where: {
          propriedade_id: propertyId,
        },
        include: {
          avaliacoes: {
            orderBy: {
              data: 'desc',
            },
            take: 1,
            select: {
              id: true,
              data: true,
              cud: true,
              cuc: true,
            },
          },
        },
        orderBy: {
          indentificacao: 'asc',
        },
      });

      // Formatar a resposta para incluir ultima avaliação
      return areas.map(area => ({
        id: area.id,
        indentificacao: area.indentificacao,
        area_ha: area.area_ha,
        propriedade_id: area.propriedade_id,
        ultimaAvaliacao: area.avaliacoes[0] || null,
      }));
    } catch (error) {
      console.error('Erro ao buscar áreas:', error);
      throw new BadRequestException('Erro ao buscar áreas: ' + error.message);
    }
  }

  async getAreaById(id: string) {
    try {
      const area = await this.prisma.unidade_avaliada.findUnique({
        where: { id },
        include: {
          avaliacoes: {
            orderBy: {
              data: 'desc',
            },
            select: {
              id: true,
              data: true,
              cud: true,
              cuc: true,
              area_irrigada: true,
              volume_agua: true,
              tempo_irrigacao: true,
            },
          },
          propiedade: {
            select: {
              id: true,
              nome: true,
            },
          },
        },
      });

      if (!area) {
        throw new BadRequestException('Área não encontrada');
      }

      return {
        id: area.id,
        indentificacao: area.indentificacao,
        area_ha: area.area_ha,
        propriedade_id: area.propriedade_id,
        propriedade: area.propiedade,
        avaliacoes: area.avaliacoes,
      };
    } catch (error) {
      console.error('Erro ao buscar área:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao buscar área: ' + error.message);
    }
  }
}
