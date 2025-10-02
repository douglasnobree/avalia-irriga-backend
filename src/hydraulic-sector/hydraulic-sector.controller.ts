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
  @ApiOperation({ summary: 'Listar setores hidráulicos por usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de setores hidráulicos do usuário',
    type: [HydraulicSector],
  })
  findByUserId(@Session() session: UserSession) {
    const userId = session.user.id;
    return this.hydraulicSectorService.findByUserId(userId);
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
    // Garante que id não seja enviado pelo cliente e tipo_setor sempre é SETOR_HIDRAULICO
    const { userId, ...data } = createHydraulicSectorDto;
    return this.hydraulicSectorService.create({
      ...data,
      userId,
      // @ts-ignore
      tipo_setor: 'SETOR_HIDRAULICO',
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
