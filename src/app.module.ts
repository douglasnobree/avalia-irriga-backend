import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/prisma/prisma.module';
import { LoggerService } from './infra/logger/logger.service';
import { ProtectedController } from './protected.controller';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { PropertyModule } from './property/property.module';
import { HydraulicSectorModule } from './hydraulic-sector/hydraulic-sector.module';
import { auth } from './lib/auth';

@Module({
  imports: [
    AuthModule.forRoot({auth}),
    PrismaModule,
    PropertyModule,
    HydraulicSectorModule,
  ],
  controllers: [ProtectedController],
  providers: [LoggerService],
  exports: [LoggerService], 
})
export class AppModule {}
