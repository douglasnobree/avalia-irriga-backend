
import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController, AreasController, AvaliacoesController } from './property.controller';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { UniformityCalculationsService, GeocodingService } from '../common/services';

@Module({
  imports: [PrismaModule],
  controllers: [PropertyController, AreasController, AvaliacoesController],
  providers: [PropertyService, UniformityCalculationsService, GeocodingService],
})
export class PropertyModule { }
