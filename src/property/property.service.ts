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

  async findOne(nome: string) {
    const property = await this.prisma.propriedade.findUnique({
      where: { nome: nome },
    });
    return property;
  }

  async update(nome: string, updatePropertyDto: UpdatePropertyDto) {
    const property = await this.prisma.propriedade.findUnique({
      where: { nome: nome },
    })

    if (!property) {
      throw new Error('Propriedade não encontrada');
    }

    const { userId, ...updateData } = updatePropertyDto;
    return this.prisma.propriedade.update({
      where: { nome: nome },
      data: updateData,
    });
  }

  async remove(nome: string) {
    const property = await this.prisma.propriedade.findUnique({
      where: { nome: nome },
    });

    if (!property) {
      throw new Error('Propriedade não encontrada');
    }

    return this.prisma.propriedade.delete({
      where: { nome: nome },
    });
  }
}
