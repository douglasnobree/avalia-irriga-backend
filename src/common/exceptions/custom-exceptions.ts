import {
  HttpException,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';

export class PropertyNotFoundException extends NotFoundException {
  constructor(id?: string) {
    super(
      id
        ? `Propriedade com ID '${id}' não encontrada`
        : 'Propriedade não encontrada',
    );
  }
}

export class AreaNotFoundException extends NotFoundException {
  constructor(id?: string) {
    super(
      id ? `Área com ID '${id}' não encontrada` : 'Área não encontrada',
    );
  }
}

export class AvaliacaoNotFoundException extends NotFoundException {
  constructor(id?: string) {
    super(
      id
        ? `Avaliação com ID '${id}' não encontrada`
        : 'Avaliação não encontrada',
    );
  }
}

export class HydraulicSectorNotFoundException extends NotFoundException {
  constructor(id?: string) {
    super(
      id
        ? `Setor hidráulico com ID '${id}' não encontrado`
        : 'Setor hidráulico não encontrado',
    );
  }
}

export class UnauthorizedOperationException extends UnauthorizedException {
  constructor(operation: string) {
    super(`Você não tem permissão para ${operation}`);
  }
}

export class InvalidDataException extends BadRequestException {
  constructor(field: string, reason?: string) {
    super(
      reason
        ? `Dados inválidos no campo '${field}': ${reason}`
        : `Dados inválidos no campo '${field}'`,
    );
  }
}

export class DuplicateResourceException extends ConflictException {
  constructor(resource: string, identifier: string) {
    super(`${resource} com identificador '${identifier}' já existe`);
  }
}
