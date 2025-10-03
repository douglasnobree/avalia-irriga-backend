
import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController, AreasController } from './property.controller';
import { PrismaModule } from '../infra/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PropertyController, AreasController],
  providers: [PropertyService],
})
export class PropertyModule { }
