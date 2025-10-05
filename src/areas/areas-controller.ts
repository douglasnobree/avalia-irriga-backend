import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { AreasService } from './areas.service';
import { AreasResponseDto, FindAreasDto } from './dto';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Get('/:propertyId')
  async findAll(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
  ): Promise<AreasResponseDto> {
    return this.areasService.findAll(propertyId);
  }
}
