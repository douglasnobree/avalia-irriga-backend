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
import { CreateAreaDto } from './dto/create-area.dto';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { AuthGuard, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
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

  @Get('my-properties')
  findMyProperties(@Session() session: UserSession) {
    const userId = session.user.id;
    return this.propertyService.findByUserId(userId);
  }

  @Get('organization/:organizationId')
  findByOrganization(@Param('organizationId') organizationId: string) {
    return this.propertyService.findByOrganization(organizationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @Session() session: UserSession,
  ) {
    const userId = session.user.id;
    return this.propertyService.updateProperty(id, updatePropertyDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Session() session: UserSession) {
    const userId = session.user.id;
    return this.propertyService.deleteProperty(id, userId);
  }
}

@Controller('areas')
@UseGuards(AuthGuard)
export class AreasController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  createArea(@Body() createAreaDto: CreateAreaDto, @Session() session: UserSession) {
    const userId = session.user.id;
    return this.propertyService.createArea(createAreaDto, userId);
  }

  @Get('property/:propertyId')
  getAreasByProperty(@Param('propertyId') propertyId: string) {
    return this.propertyService.getAreasByProperty(propertyId);
  }

  @Get(':id')
  getAreaById(@Param('id') id: string) {
    return this.propertyService.getAreaById(id);
  }

  @Patch(':id')
  updateArea(
    @Param('id') id: string,
    @Body() data: any,
    @Session() session: UserSession,
  ) {
    const userId = session.user.id;
    return this.propertyService.updateArea(id, data, userId);
  }

  @Delete(':id')
  deleteArea(@Param('id') id: string, @Session() session: UserSession) {
    const userId = session.user.id;
    return this.propertyService.deleteArea(id, userId);
  }
}

@Controller('avaliacoes')
@UseGuards(AuthGuard)
export class AvaliacoesController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  createAvaliacao(
    @Body() createAvaliacaoDto: CreateAvaliacaoDto,
    @Session() session: UserSession,
  ) {
    const userId = session.user.id;
    return this.propertyService.createAvaliacao(createAvaliacaoDto, userId);
  }

  @Get('area/:areaId')
  getAvaliacoesByArea(@Param('areaId') areaId: string) {
    return this.propertyService.getAvaliacoesByArea(areaId);
  }

  @Get(':id')
  getAvaliacaoById(@Param('id') id: string) {
    return this.propertyService.getAvaliacaoById(id);
  }

  @Delete(':id')
  deleteAvaliacao(@Param('id') id: string, @Session() session: UserSession) {
    const userId = session.user.id;
    return this.propertyService.deleteAvaliacao(id, userId);
  }
}
