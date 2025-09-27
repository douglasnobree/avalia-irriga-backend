import { Module } from '@nestjs/common';
import { HydraulicSectorController } from './hydraulic-sector.controller';
import { HydraulicSectorService } from './hydraulic-sector.service';
import { PrismaModule } from '../infra/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HydraulicSectorController],
  providers: [HydraulicSectorService],
  exports: [HydraulicSectorService],
})
export class HydraulicSectorModule {}