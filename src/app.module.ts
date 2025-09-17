import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/prisma/prisma.module';
import { LoggerService } from './infra/logger/logger.service';
import { AuthModule } from './auth/auth.module';
import { ProtectedController } from './protected.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ProtectedController],
  providers: [LoggerService],
  exports: [LoggerService], // Exportar para ser usado em outros módulos
})
export class AppModule {}
