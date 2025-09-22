import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/prisma/prisma.module';
import { LoggerService } from './infra/logger/logger.service';
import { AuthModule } from './auth/auth.module';
import { ProtectedController } from './protected.controller';
import { PropertyModule } from './property/property.module';

@Module({
  imports: [PrismaModule, AuthModule, PropertyModule],
  controllers: [ProtectedController],
  providers: [LoggerService],
  exports: [LoggerService], // Exportar para ser usado em outros módulos
})
export class AppModule {}
