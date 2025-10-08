import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../infra/prisma/prisma.service';
import { CreateHydraulicSectorDto } from './dto/create-hydraulic-sector.dto';
import { UpdateHydraulicSectorDto } from './dto/update-hydraulic-sector.dto';

@Injectable()
export class HydraulicSectorService {
  constructor(private prisma: PrismaService) {}
  async findByPropertyId(propriedadeId: string) {
    return this.prisma.setor_Hidraulico.findMany({
      where: { propriedadeId },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.setor_Hidraulico.findMany({
      where: { userId },
    });
  }

  async create(data: CreateHydraulicSectorDto) {
    try {
      console.log('🔧 Dados recebidos para criar setor hidráulico:', JSON.stringify(data, null, 2));
      
      const hydraulicSector = await this.prisma.setor_Hidraulico.create({
        // @ts-ignore
        data,
      });
      
      console.log('✅ Setor hidráulico criado com sucesso:', hydraulicSector.id);
      return hydraulicSector;
    } catch (error) {
      console.error('❌ Erro ao criar setor hidráulico:', error);
      throw error;
    }
  }

  async findAll() {
    const hydraulicSectors = await this.prisma.setor_Hidraulico.findMany();
    return hydraulicSectors;
  }

  async findOne(id: string) {
    const hydraulicSector = await this.prisma.setor_Hidraulico.findUnique({
      where: { id },
    });
    return hydraulicSector;
  }

  async update(id: string, updateHydraulicSectorDto: UpdateHydraulicSectorDto) {
    const hydraulicSector = await this.prisma.setor_Hidraulico.findUnique({
      where: { id },
    });

    if (!hydraulicSector) {
      throw new NotFoundException(
        `Setor hidráulico com ID '${id}' não encontrado`,
      );
    }

    return this.prisma.setor_Hidraulico.update({
      where: { id },
      // @ts-ignore
      data: updateHydraulicSectorDto,
    });
  }

  async remove(id: string) {
    const hydraulicSector = await this.prisma.setor_Hidraulico.findUnique({
      where: { id },
    });

    if (!hydraulicSector) {
      throw new NotFoundException(
        `Setor hidráulico com ID '${id}' não encontrado`,
      );
    }

    return this.prisma.setor_Hidraulico.delete({
      where: { id },
    });
  }

  async findAreasByPropertyId(propertyId: string) {
    const areas = await this.prisma.setor_Hidraulico.findMany({
      where: {
        propriedadeId: propertyId,
      },
      include: {
        avaliacoes: {
          orderBy: {
            data: 'desc',
          },
          take: 1,
        },
      },
    });
    console.log(areas, propertyId);

    if (!areas || areas.length === 0) {
      throw new NotFoundException(
        'Nenhuma área encontrada para esta propriedade',
      );
    }

    return areas;
  }
}
