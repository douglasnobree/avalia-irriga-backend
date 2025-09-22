import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class PropertyService {

  constructor(private prisma: PrismaService) { }

  async create(data: CreatePropertyDto) {
    const property = await this.prisma.property.create({ data: data });
    return property;
  }

  async findAll() {
    const property = await this.prisma.property.findMany();
    return property;
  }

  async findOne(id: number) {
    const property = await this.prisma.property.findUnique({
      where: { id: id },
    });
    return property;
  }

  async update(id: number, updatePropertyDto: UpdatePropertyDto) {
    const property = await this.prisma.property.findUnique({
      where: { id: id },
    })

    if (!property) {
      throw new Error('Propriedade não encontrada');
    }

    return this.prisma.property.update({
      where: { id: id },
      data: updatePropertyDto,
    });
  }

  async remove(id: number) {
    const property = await this.prisma.property.findUnique({
      where: { id: id },
    });

    if (!property) {
      throw new Error('Propriedade não encontrada');
    }

    return this.prisma.property.delete({
      where: { id: id },
    });
  }
}
