import { Injectable, BadRequestException } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { CreateAreaDto } from './dto/create-area.dto';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { UniformityCalculationsService } from '../common/services/uniformity-calculations.service';

@Injectable()
export class PropertyService {
  constructor(
    private prisma: PrismaService,
    private uniformityCalc: UniformityCalculationsService,
  ) {}

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
              identificacao: dto.area.indentificacao, // Usa a identificação da área
              fabricante: dto.setor_hidraulico.fabricante,
              modelo: dto.setor_hidraulico.modelo,
              vazao_nominal: dto.setor_hidraulico.vazao_nominal,
              pressao_trabalho: dto.setor_hidraulico.pressao_trabalho,
              dist_emissores: dto.setor_hidraulico.dist_emissores,
              dist_laterais: dto.setor_hidraulico.dist_laterais,
              filtro_tipo: dto.setor_hidraulico.filtro_tipo,
              malha_filtro: dto.setor_hidraulico.malha_filtro,
              valvula_tipo: dto.setor_hidraulico.valvula_tipo,
              energia_tipo: dto.setor_hidraulico.energia_tipo,
              condicoes_gerais: dto.setor_hidraulico.condicoes_gerais,
              freq_manutencao: dto.setor_hidraulico.freq_manutencao,
              data_ultima_manutencao: new Date(dto.setor_hidraulico.data_ultima_manutencao),
              emissor_type: dto.setor_hidraulico.emissor_type,
              tipo_setor: dto.setor_hidraulico.tipo_setor,
              propriedadeId: dto.area.propriedade_id,
              userId,
            },
          });
        }

        // 3. Criar o Pivô Central (se fornecido)
        if (dto.pivo_central) {
          await tx.pivo_Central.create({
            data: {
              identificacao: dto.area.indentificacao, // Usa a identificação da área
              num_torres: dto.pivo_central.num_torres,
              comprimento: dto.pivo_central.comprimento,
              fabricante: dto.pivo_central.fabricante || '',
              modelo: dto.pivo_central.modelo || '',
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
              propriedadeId: dto.area.propriedade_id,
              userId,
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

      // Buscar setor hidráulico ou pivô central associado pelo identificacao
      const setorHidraulico = await this.prisma.setor_Hidraulico.findFirst({
        where: { 
          identificacao: area.indentificacao,
          propriedadeId: area.propriedade_id,
        },
      });

      const pivoCentral = await this.prisma.pivo_Central.findFirst({
        where: { 
          identificacao: area.indentificacao,
          propriedadeId: area.propriedade_id,
        },
      });

      return {
        id: area.id,
        indentificacao: area.indentificacao,
        area_ha: area.area_ha,
        propriedade_id: area.propriedade_id,
        propriedade: area.propiedade,
        avaliacoes: area.avaliacoes,
        setor_hidraulico: setorHidraulico,
        pivo_central: pivoCentral,
        tipo_setor: setorHidraulico ? 'SETOR_HIDRAULICO' : pivoCentral ? 'PIVO_CENTRAL' : null,
      };
    } catch (error) {
      console.error('Erro ao buscar área:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao buscar área: ' + error.message);
    }
  }

  async createAvaliacao(dto: CreateAvaliacaoDto, userId: string) {
    try {
      // Verificar se a unidade avaliada existe
      const unidadeAvaliada = await this.prisma.unidade_avaliada.findUnique({
        where: { id: dto.unidade_id },
      });

      if (!unidadeAvaliada) {
        throw new BadRequestException('Unidade avaliada não encontrada');
      }

      // Calcular vazões e coeficientes de uniformidade
      let cuc = 0;
      let cud = 0;
      let cue = 0;

      if (dto.pontos && dto.pontos.length > 0) {
        // Calcular vazão para cada ponto (se não foi fornecida)
        const pontosComVazao = dto.pontos.map(ponto => {
          if (!ponto.vazao_l_h && ponto.volume_ml && ponto.tempo_seg) {
            ponto.vazao_l_h = this.uniformityCalc.calcularVazao(
              ponto.volume_ml,
              ponto.tempo_seg,
            );
          }
          return ponto;
        });

        // Extrair apenas as vazões para cálculo dos coeficientes
        const vazoes = pontosComVazao
          .map(p => p.vazao_l_h)
          .filter(v => v && v > 0);

        if (vazoes.length > 0) {
          const coeficientes = this.uniformityCalc.calcularCoeficientes(vazoes);
          cuc = coeficientes.cuc;
          cud = coeficientes.cud;
          cue = coeficientes.cue;
        }

        // Atualizar o DTO com as vazões calculadas
        dto.pontos = pontosComVazao;
      }

      // Usar transação para garantir atomicidade
      return await this.prisma.$transaction(async (tx) => {
        // 1. Criar a Avaliação com os coeficientes calculados
        const avaliacao = await tx.avaliacao.create({
          data: {
            data: new Date(),
            area_irrigada: dto.area_irrigada,
            volume_agua: dto.volume_agua,
            tempo_irrigacao: dto.tempo_irrigacao,
            cud: cud,
            cuc: cuc,
            cue: cue,
            offline_status: dto.offline_status,
            avaliador_id: userId,
            unidade_type: dto.unidade_type,
            unidade_id: dto.unidade_id,
            setor_id: dto.setor_id,
            pivo_id: dto.pivo_id,
          },
        });

        // 2. Criar os pontos de medição com base no tipo de unidade
        if (dto.pontos && dto.pontos.length > 0) {
          if (dto.unidade_type === 'SETOR_HIDRAULICO') {
            // Criar pontos para Setor Hidráulico
            await tx.ponto_localizada.createMany({
              data: dto.pontos.map(ponto => {
                const pontoData: any = {
                  eixo_x: ponto.eixo_x || 0,
                  eixo_y: ponto.eixo_y || 0,
                  volume_ml: ponto.volume_ml,
                  tempo_seg: ponto.tempo_seg,
                  vazao_l_h: ponto.vazao_l_h,
                  avaliacao_id: avaliacao.id,
                };
                if (dto.setor_id) {
                  pontoData.setor_id = dto.setor_id;
                }
                return pontoData;
              }),
            });
          } else if (dto.unidade_type === 'PIVO_CENTRAL') {
            // Criar pontos para Pivô Central
            await tx.ponto_pivo.createMany({
              data: dto.pontos.map(ponto => {
                const pontoData: any = {
                  sequencia: ponto.sequencia,
                  distancia: ponto.distancia || 0,
                  diametro_coletor: ponto.diametro_coletor,
                  volume_ml: ponto.volume_ml,
                  tempo_seg: ponto.tempo_seg,
                  vazao_l_h: ponto.vazao_l_h,
                  avaliacao_id: avaliacao.id,
                };
                if (dto.pivo_id) {
                  pontoData.pivo_id = dto.pivo_id;
                }
                return pontoData;
              }),
            });
          }
        }

        // 3. Criar comentários (se fornecidos)
        if (dto.comentarios) {
          await tx.comentario.create({
            data: {
              comentario: dto.comentarios,
              avaliacao_id: avaliacao.id,
            },
          });
        }

        // 4. Criar recomendações como comentário (se fornecido)
        if (dto.recomendacoes) {
          await tx.comentario.create({
            data: {
              comentario: `[RECOMENDAÇÕES] ${dto.recomendacoes}`,
              avaliacao_id: avaliacao.id,
            },
          });
        }

        // 5. Obter classificações dos coeficientes
        const classificacaoCUC = this.uniformityCalc.classificarCUC(cuc);
        const classificacaoCUD = this.uniformityCalc.classificarCUD(cud);
        const classificacaoCUE = this.uniformityCalc.classificarCUE(cue);

        return {
          success: true,
          message: 'Avaliação criada com sucesso',
          data: {
            id: avaliacao.id,
            data: avaliacao.data,
            coeficientes: {
              cuc: classificacaoCUC,
              cud: classificacaoCUD,
              cue: classificacaoCUE,
            },
          },
        };
      });
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao criar avaliação: ' + error.message);
    }
  }

  async getAvaliacoesByArea(areaId: string) {
    try {
      const avaliacoes = await this.prisma.avaliacao.findMany({
        where: {
          unidade_id: areaId,
        },
        include: {
          Comentario: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
        orderBy: {
          data: 'desc',
        },
      });

      return avaliacoes;
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      throw new BadRequestException('Erro ao buscar avaliações: ' + error.message);
    }
  }

  async getAvaliacaoById(id: string) {
    try {
      const avaliacao = await this.prisma.avaliacao.findUnique({
        where: { id },
        include: {
          unidade: {
            select: {
              id: true,
              indentificacao: true,
              area_ha: true,
              propriedade_id: true,
            },
          },
          Ponto_localizada: {
            orderBy: {
              eixo_x: 'asc',
            },
          },
          Ponto_pivo: {
            orderBy: {
              sequencia: 'asc',
            },
          },
          Comentario: {
            orderBy: {
              createdAt: 'desc',
            },
            include: {
              Foto: true,
            },
          },
        },
      });

      if (!avaliacao) {
        throw new BadRequestException('Avaliação não encontrada');
      }

      return avaliacao;
    } catch (error) {
      console.error('Erro ao buscar avaliação:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao buscar avaliação: ' + error.message);
    }
  }

  // ========== MÉTODOS DE ATUALIZAÇÃO ==========

  async updateProperty(id: string, data: UpdatePropertyDto, userId: string) {
    try {
      // Verificar se a propriedade existe e pertence ao usuário
      const property = await this.prisma.propriedade.findUnique({
        where: { id },
      });

      if (!property) {
        throw new BadRequestException('Propriedade não encontrada');
      }

      if (property.userId !== userId) {
        throw new BadRequestException('Você não tem permissão para editar esta propriedade');
      }

      const { userId: _, ...updateData } = data;
      return this.prisma.propriedade.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      console.error('Erro ao atualizar propriedade:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao atualizar propriedade: ' + error.message);
    }
  }

  async updateArea(id: string, data: any, userId: string) {
    try {
      // Verificar se a área existe
      const area = await this.prisma.unidade_avaliada.findUnique({
        where: { id },
        include: {
          propiedade: true,
        },
      });

      if (!area) {
        throw new BadRequestException('Área não encontrada');
      }

      // Verificar se o usuário é dono da propriedade
      if (area.propiedade.userId !== userId) {
        throw new BadRequestException('Você não tem permissão para editar esta área');
      }

      // Usar transação para garantir atomicidade
      return await this.prisma.$transaction(async (tx) => {
        // 1. Atualizar Unidade_avaliada
        const updatedArea = await tx.unidade_avaliada.update({
          where: { id },
          data: {
            indentificacao: data.area?.indentificacao || area.indentificacao,
            area_ha: data.area?.area_ha || area.area_ha,
          },
        });

        // 2. Atualizar Setor Hidráulico (se fornecido)
        if (data.setor_hidraulico) {
          // Buscar setor existente
          const setorExistente = await tx.setor_Hidraulico.findFirst({
            where: {
              identificacao: area.indentificacao,
              propriedadeId: area.propriedade_id,
            },
          });

          if (setorExistente) {
            await tx.setor_Hidraulico.update({
              where: { id: setorExistente.id },
              data: {
                identificacao: data.area?.indentificacao || area.indentificacao, // Atualiza identificação se mudou
                fabricante: data.setor_hidraulico.fabricante,
                modelo: data.setor_hidraulico.modelo,
                vazao_nominal: data.setor_hidraulico.vazao_nominal,
                pressao_trabalho: data.setor_hidraulico.pressao_trabalho,
                dist_emissores: data.setor_hidraulico.dist_emissores,
                dist_laterais: data.setor_hidraulico.dist_laterais,
                filtro_tipo: data.setor_hidraulico.filtro_tipo,
                malha_filtro: data.setor_hidraulico.malha_filtro,
                valvula_tipo: data.setor_hidraulico.valvula_tipo,
                energia_tipo: data.setor_hidraulico.energia_tipo,
                condicoes_gerais: data.setor_hidraulico.condicoes_gerais,
                freq_manutencao: data.setor_hidraulico.freq_manutencao,
                data_ultima_manutencao: new Date(data.setor_hidraulico.data_ultima_manutencao),
                emissor_type: data.setor_hidraulico.emissor_type,
              },
            });
          }
        }

        // 3. Atualizar Pivô Central (se fornecido)
        if (data.pivo_central) {
          // Buscar pivô existente
          const pivoExistente = await tx.pivo_Central.findFirst({
            where: {
              identificacao: area.indentificacao,
              propriedadeId: area.propriedade_id,
            },
          });

          if (pivoExistente) {
            await tx.pivo_Central.update({
              where: { id: pivoExistente.id },
              data: {
                identificacao: data.area?.indentificacao || area.indentificacao, // Atualiza identificação se mudou
                num_torres: data.pivo_central.num_torres,
                comprimento: data.pivo_central.comprimento,
                fabricante: data.pivo_central.fabricante || '',
                modelo: data.pivo_central.modelo || '',
                emissor_type: data.pivo_central.emissor_type,
                energia_tipo: data.pivo_central.energia_tipo,
                potencia_motor: data.pivo_central.potencia_motor,
                vazao_operacao: data.pivo_central.vazao_operacao,
                controle_tipo: data.pivo_central.controle_tipo,
                fertirrigacao: data.pivo_central.fertirrigacao,
                fonte_hidrica: data.pivo_central.fonte_hidrica,
                tempo_funcionamento: data.pivo_central.tempo_funcionamento,
                velocidade: data.pivo_central.velocidade,
                bocal_tipo: data.pivo_central.bocal_tipo,
                pressao_bocal: data.pivo_central.pressao_bocal,
                data_ultima_manutencao: new Date(data.pivo_central.data_ultima_manutencao),
                freq_manutencao: data.pivo_central.freq_manutencao,
                problemas_observados: data.pivo_central.problemas_observados || '',
                data_ultima_avaliacoes: new Date(data.pivo_central.data_ultima_avaliacoes),
              },
            });
          }
        }

        return {
          success: true,
          message: 'Área atualizada com sucesso',
          data: updatedArea,
        };
      });
    } catch (error) {
      console.error('Erro ao atualizar área:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao atualizar área: ' + error.message);
    }
  }

  // ========== MÉTODOS DE EXCLUSÃO ==========

  async deleteProperty(id: string, userId: string) {
    try {
      // Verificar se a propriedade existe e pertence ao usuário
      const property = await this.prisma.propriedade.findUnique({
        where: { id },
        include: {
          Unidade_avaliada: {
            include: {
              avaliacoes: true,
            },
          },
        },
      });

      if (!property) {
        throw new BadRequestException('Propriedade não encontrada');
      }

      if (property.userId !== userId) {
        throw new BadRequestException('Você não tem permissão para excluir esta propriedade');
      }

      // Verificar se há dados dependentes
      const totalAreas = property.Unidade_avaliada.length;
      const totalAvaliacoes = property.Unidade_avaliada.reduce(
        (acc, area) => acc + area.avaliacoes.length,
        0
      );

      if (totalAreas > 0 || totalAvaliacoes > 0) {
        throw new BadRequestException(
          `Não é possível excluir esta propriedade pois ela possui ${totalAreas} área(s) e ${totalAvaliacoes} avaliação(ões). Exclua-as primeiro.`
        );
      }

      await this.prisma.propriedade.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Propriedade excluída com sucesso',
      };
    } catch (error) {
      console.error('Erro ao excluir propriedade:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao excluir propriedade: ' + error.message);
    }
  }

  async deleteArea(id: string, userId: string) {
    try {
      // Verificar se a área existe
      const area = await this.prisma.unidade_avaliada.findUnique({
        where: { id },
        include: {
          propiedade: true,
          avaliacoes: true,
        },
      });

      if (!area) {
        throw new BadRequestException('Área não encontrada');
      }

      // Verificar se o usuário é dono da propriedade
      if (area.propiedade.userId !== userId) {
        throw new BadRequestException('Você não tem permissão para excluir esta área');
      }

      // Verificar se há avaliações
      if (area.avaliacoes.length > 0) {
        throw new BadRequestException(
          `Não é possível excluir esta área pois ela possui ${area.avaliacoes.length} avaliação(ões). Exclua-as primeiro.`
        );
      }

      await this.prisma.unidade_avaliada.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Área excluída com sucesso',
      };
    } catch (error) {
      console.error('Erro ao excluir área:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao excluir área: ' + error.message);
    }
  }

  async deleteAvaliacao(id: string, userId: string) {
    try {
      // Verificar se a avaliação existe
      const avaliacao = await this.prisma.avaliacao.findUnique({
        where: { id },
        include: {
          unidade: {
            include: {
              propiedade: true,
            },
          },
          Ponto_localizada: true,
          Ponto_pivo: true,
          Comentario: {
            include: {
              Foto: true,
            },
          },
        },
      });

      if (!avaliacao) {
        throw new BadRequestException('Avaliação não encontrada');
      }

      // Verificar se o usuário é dono da propriedade
      if (avaliacao.unidade.propiedade.userId !== userId) {
        throw new BadRequestException('Você não tem permissão para excluir esta avaliação');
      }

      // Usar transação para excluir tudo relacionado
      await this.prisma.$transaction(async (tx) => {
        // Excluir fotos dos comentários
        if (avaliacao.Comentario.length > 0) {
          for (const comentario of avaliacao.Comentario) {
            if (comentario.Foto.length > 0) {
              await tx.foto.deleteMany({
                where: { comentario_id: comentario.id },
              });
            }
          }
          // Excluir comentários
          await tx.comentario.deleteMany({
            where: { avaliacao_id: id },
          });
        }

        // Excluir pontos
        await tx.ponto_localizada.deleteMany({
          where: { avaliacao_id: id },
        });
        await tx.ponto_pivo.deleteMany({
          where: { avaliacao_id: id },
        });

        // Excluir avaliação
        await tx.avaliacao.delete({
          where: { id },
        });
      });

      return {
        success: true,
        message: 'Avaliação excluída com sucesso',
      };
    } catch (error) {
      console.error('Erro ao excluir avaliação:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao excluir avaliação: ' + error.message);
    }
  }
}
