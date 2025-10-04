import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HydraulicSectorService } from './hydraulic-sector.service';
import { CreateHydraulicSectorDto } from './dto/create-hydraulic-sector.dto';
import { UpdateHydraulicSectorDto } from './dto/update-hydraulic-sector.dto';
import { HydraulicSector } from './entities/hydraulic-sector.entity';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
@ApiTags('Setor Hidráulico')
@Controller('hydraulic-sector')
export class HydraulicSectorController {
  @Get('my-sectors')
  @ApiOperation({
    summary: 'Listar todos os setores hidráulicos do usuário logado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de setores hidráulicos do usuário',
    type: [HydraulicSector],
  })
  findMyHydraulicSectors(@Session() session: UserSession) {
    return this.hydraulicSectorService.findByUserId(session.user.id);
  }

  @Get('by-property/:propertyId')
  @ApiOperation({ summary: 'Listar setores hidráulicos por propriedade' })
  @ApiResponse({
    status: 200,
    description: 'Lista de setores hidráulicos da propriedade',
    type: [HydraulicSector],
  })
  findByPropertyId(@Param('propertyId') propertyId: string) {
    return this.hydraulicSectorService.findByPropertyId(propertyId);
  }

  @Get('property/:propertyId/areas')
  @ApiOperation({ summary: 'Listar todas as áreas de uma propriedade' })
  @ApiResponse({
    status: 200,
    description: 'Lista de áreas da propriedade',
  })
  @ApiResponse({ status: 404, description: 'Propriedade não encontrada' })
  findAreasByPropertyId(@Param('propertyId') propertyId: string) {
    return this.hydraulicSectorService.findAreasByPropertyId(propertyId);
  }

  constructor(
    private readonly hydraulicSectorService: HydraulicSectorService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo setor hidráulico' })
  @ApiCreatedResponse({
    description: 'Setor hidráulico criado com sucesso',
    type: HydraulicSector,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createHydraulicSectorDto: CreateHydraulicSectorDto) {
    return this.hydraulicSectorService.create({
      ...createHydraulicSectorDto,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os setores hidráulicos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos os setores hidráulicos',
    type: [HydraulicSector],
  })
  findAll() {
    return this.hydraulicSectorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um setor hidráulico pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Setor hidráulico encontrado',
    type: HydraulicSector,
  })
  @ApiResponse({ status: 404, description: 'Setor hidráulico não encontrado' })
  findOne(@Param('id') id: string) {
    return this.hydraulicSectorService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um setor hidráulico' })
  @ApiResponse({
    status: 200,
    description: 'Setor hidráulico atualizado com sucesso',
    type: HydraulicSector,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Setor hidráulico não encontrado' })
  update(
    @Param('id') id: string,
    @Body() updateHydraulicSectorDto: UpdateHydraulicSectorDto,
  ) {
    return this.hydraulicSectorService.update(id, updateHydraulicSectorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um setor hidráulico' })
  @ApiResponse({
    status: 200,
    description: 'Setor hidráulico removido com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Setor hidráulico não encontrado' })
  remove(@Param('id') id: string) {
    return this.hydraulicSectorService.remove(id);
  }
}
