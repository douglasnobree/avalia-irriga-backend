import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class PropertyService {

  constructor(private prisma: PrismaService) { }

  async create(data: CreatePropertyDto) {
    const property = await this.prisma.propriedade.create({
      data
    });
    return property;
  }

  async findAll() {
    const property = await this.prisma.propriedade.findMany();
    return property;
  }

  async findOne(id: string) {
    const property = await this.prisma.propriedade.findUnique({
      where: { id: id },
    });
    return property;
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto) {
    const property = await this.prisma.propriedade.findUnique({
      where: { id: id },
    })

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
