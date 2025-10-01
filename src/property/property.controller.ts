import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import { RolesGuard } from 'src/common';

@Controller('property')
@UseGuards(AuthGuard)
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  create(@Body() data: CreatePropertyDto) {
    return this.propertyService.create(data);
  }

  @Get()
  findAll() {
    return this.propertyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyService.findOne(id);
  }

  @Get('organization/:organizationId')
  findByOrganization(@Param('organizationId') organizationId: string) {
    return this.propertyService.findByOrganization(organizationId);
  }

  @Patch(':nome')
  update(
    @Param('nome') nome: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertyService.update(nome, updatePropertyDto);
  }

  @Delete(':nome')
  remove(@Param('nome') nome: string) {
    return this.propertyService.remove(nome);
  }
}
