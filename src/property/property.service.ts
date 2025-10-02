import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
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
}
