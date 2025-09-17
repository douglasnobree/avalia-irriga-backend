import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private logger: Logger;
  private currentContext: string;

  constructor() {
    this.currentContext = 'LoggerService';
    this.logger = new Logger(this.currentContext);
  }

  setContext(context: string) {
    this.currentContext = context;
    this.logger = new Logger(this.currentContext);
  }

  log(message: string, context?: string) {
    this.logger.log(message, context || this.currentContext);
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, trace, context || this.currentContext);
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, context || this.currentContext);
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, context || this.currentContext);
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, context || this.currentContext);
  }

  // Método personalizado para log de requisições HTTP
  logRequest(method: string, url: string, userAgent?: string, ip?: string) {
    this.logger.log(
      `[${method}] ${url} - User-Agent: ${userAgent || 'N/A'} - IP: ${ip || 'N/A'}`,
      'HTTP',
    );
  }

  // Método para log de erros com stack trace
  logErrorWithStack(error: Error, context?: string) {
    this.logger.error(
      error.message,
      error.stack,
      context || this.currentContext,
    );
  }

  // Método para log de performance
  logPerformance(operation: string, duration: number, context?: string) {
    this.logger.log(
      `Operation: ${operation} - Duration: ${duration}ms`,
      context || 'Performance',
    );
  }
}
