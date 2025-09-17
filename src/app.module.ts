import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/prisma/prisma.module';
import { LoggerService } from './infra/logger/logger.service';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [LoggerService],
  exports: [LoggerService], // Exportar para ser usado em outros módulos
})
export class AppModule {}
