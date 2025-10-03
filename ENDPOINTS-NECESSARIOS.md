# 🔧 Endpoints Necessários no Backend

Este documento lista todos os endpoints que precisam ser criados no backend para que as novas telas funcionem completamente.

---

## 📋 Endpoints Faltantes

### 1. **Áreas (Unidades Avaliadas)**

#### `POST /areas`
Criar uma nova área de cultivo

**Request Body:**
```json
{
  "indentificacao": "Talhão A",
  "area_ha": 15.5,
  "propriedade_id": "uuid-da-propriedade"
}
```

**Response:**
```json
{
  "id": "uuid-da-area",
  "indentificacao": "Talhão A",
  "area_ha": 15.5,
  "propriedade_id": "uuid-da-propriedade"
}
```

---

#### `GET /areas/:id`
Buscar uma área específica

**Response:**
```json
{
  "id": "uuid-da-area",
  "indentificacao": "Talhão A",
  "area_ha": 15.5,
  "propriedade_id": "uuid-da-propriedade"
}
```

---

#### `GET /property/:id/areas`
Listar todas as áreas de uma propriedade

**Response:**
```json
[
  {
    "id": "uuid-area-1",
    "indentificacao": "Talhão A",
    "area_ha": 15.5,
    "propriedade_id": "uuid-da-propriedade",
    "ultimaAvaliacao": {
      "data": "2025-10-02T00:00:00.000Z",
      "cud": 90.8,
      "cuc": 92.3
    }
  },
  {
    "id": "uuid-area-2",
    "indentificacao": "Área 2",
    "area_ha": 12.0,
    "propriedade_id": "uuid-da-propriedade",
    "ultimaAvaliacao": null
  }
]
```

---

### 2. **Avaliações**

#### `POST /avaliacoes`
Criar uma nova avaliação

**Request Body:**
```json
{
  "area_irrigada": 15.5,
  "volume_agua": 12500,
  "tempo_irrigacao": 180,
  "cud": 90.8,
  "cuc": 92.3,
  "data": "2025-10-02T14:30:00.000Z",
  "unidade_id": "uuid-da-area",
  "offline_status": false,
  "avaliador_id": "uuid-do-usuario",
  "unidade_type": "SETOR_HIDRAULICO",
  "pontos": [
    {
      "eixo_x": 0,
      "eixo_y": 0,
      "volume_ml": 150000,
      "tempo_seg": 3600,
      "vazao_l_h": 150.0
    },
    {
      "eixo_x": 1,
      "eixo_y": 0,
      "volume_ml": 145000,
      "tempo_seg": 3600,
      "vazao_l_h": 145.0
    }
  ],
  "comentarios": "Sistema apresentando boa uniformidade.",
  "recomendacoes": "Realizar manutenção preventiva nos próximos 30 dias."
}
```

**Response:**
```json
{
  "id": "uuid-da-avaliacao",
  "area_irrigada": 15.5,
  "volume_agua": 12500,
  "tempo_irrigacao": 180,
  "cud": 90.8,
  "cuc": 92.3,
  "data": "2025-10-02T14:30:00.000Z",
  "unidade_id": "uuid-da-area",
  "offline_status": false,
  "avaliador_id": "uuid-do-usuario",
  "unidade_type": "SETOR_HIDRAULICO"
}
```

---

#### `GET /avaliacoes/:id`
Buscar uma avaliação específica com pontos de medição

**Response:**
```json
{
  "id": "uuid-da-avaliacao",
  "data": "2025-10-02T14:30:00.000Z",
  "area_irrigada": 15.5,
  "volume_agua": 12500,
  "tempo_irrigacao": 180,
  "cud": 90.8,
  "cuc": 92.3,
  "pontos": [
    {
      "id": "uuid-ponto-1",
      "vazao_l_h": 150.0,
      "eixo_x": 0,
      "eixo_y": 0,
      "volume_ml": 150000,
      "tempo_seg": 3600
    },
    {
      "id": "uuid-ponto-2",
      "vazao_l_h": 145.0,
      "eixo_x": 1,
      "eixo_y": 0,
      "volume_ml": 145000,
      "tempo_seg": 3600
    }
  ]
}
```

---

#### `GET /areas/:id/avaliacoes`
Listar todas as avaliações de uma área

**Response:**
```json
[
  {
    "id": "uuid-avaliacao-1",
    "data": "2025-10-02T14:30:00.000Z",
    "area_irrigada": 15.5,
    "volume_agua": 12500,
    "tempo_irrigacao": 180,
    "cud": 90.8,
    "cuc": 92.3
  },
  {
    "id": "uuid-avaliacao-2",
    "data": "2025-09-10T10:00:00.000Z",
    "area_irrigada": 15.5,
    "volume_agua": 13000,
    "tempo_irrigacao": 185,
    "cud": 92.1,
    "cuc": 93.5
  }
]
```

---

## 🗂️ Estrutura de Controllers e Services

### 1. **Area Controller** (`src/area/area.controller.ts`)

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AreaService } from './area.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { AuthGuard } from '@thallesp/nestjs-better-auth';

@Controller('areas')
@UseGuards(AuthGuard)
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Post()
  create(@Body() data: CreateAreaDto) {
    return this.areaService.create(data);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.areaService.findOne(id);
  }
}

@Controller('property')
@UseGuards(AuthGuard)
export class PropertyController {
  constructor(private readonly areaService: AreaService) {}

  @Get(':id/areas')
  findAreasByProperty(@Param('id') propertyId: string) {
    return this.areaService.findByProperty(propertyId);
  }
}
```

---

### 2. **Area Service** (`src/area/area.service.ts`)

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infra/prisma/prisma.service';
import { CreateAreaDto } from './dto/create-area.dto';

@Injectable()
export class AreaService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAreaDto) {
    return this.prisma.unidade_avaliada.create({
      data,
    });
  }

  async findOne(id: string) {
    return this.prisma.unidade_avaliada.findUnique({
      where: { id },
    });
  }

  async findByProperty(propertyId: string) {
    const areas = await this.prisma.unidade_avaliada.findMany({
      where: { propriedade_id: propertyId },
      include: {
        avaliacoes: {
          orderBy: { data: 'desc' },
          take: 1,
          select: {
            data: true,
            cud: true,
            cuc: true,
          },
        },
      },
    });

    return areas.map((area) => ({
      ...area,
      ultimaAvaliacao: area.avaliacoes[0] || null,
      avaliacoes: undefined,
    }));
  }
}
```

---

### 3. **Avaliacao Controller** (`src/avaliacao/avaliacao.controller.ts`)

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AvaliacaoService } from './avaliacao.service';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { AuthGuard, Session, type UserSession } from '@thallesp/nestjs-better-auth';

@Controller('avaliacoes')
@UseGuards(AuthGuard)
export class AvaliacaoController {
  constructor(private readonly avaliacaoService: AvaliacaoService) {}

  @Post()
  create(
    @Body() data: CreateAvaliacaoDto,
    @Session() session: UserSession
  ) {
    return this.avaliacaoService.create(data, session.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.avaliacaoService.findOne(id);
  }
}

@Controller('areas')
@UseGuards(AuthGuard)
export class AreasAvaliacoesController {
  constructor(private readonly avaliacaoService: AvaliacaoService) {}

  @Get(':id/avaliacoes')
  findAvaliacoesByArea(@Param('id') areaId: string) {
    return this.avaliacaoService.findByArea(areaId);
  }
}
```

---

### 4. **Avaliacao Service** (`src/avaliacao/avaliacao.service.ts`)

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infra/prisma/prisma.service';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';

@Injectable()
export class AvaliacaoService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAvaliacaoDto, userId: string) {
    const { pontos, comentarios, recomendacoes, ...avaliacaoData } = data;

    return this.prisma.avaliacao.create({
      data: {
        ...avaliacaoData,
        avaliador_id: userId,
        Ponto_localizada: {
          create: pontos.map((ponto) => ({
            ...ponto,
            setor_id: 'temporary-setor-id', // Você pode precisar ajustar isso
          })),
        },
        Comentario: comentarios
          ? {
              create: {
                comentario: `${comentarios}\n\nRecomendações: ${recomendacoes || 'N/A'}`,
              },
            }
          : undefined,
      },
      include: {
        Ponto_localizada: true,
        Comentario: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.avaliacao.findUnique({
      where: { id },
      include: {
        Ponto_localizada: {
          select: {
            id: true,
            vazao_l_h: true,
            eixo_x: true,
            eixo_y: true,
            volume_ml: true,
            tempo_seg: true,
          },
        },
      },
    });
  }

  async findByArea(areaId: string) {
    return this.prisma.avaliacao.findMany({
      where: { unidade_id: areaId },
      orderBy: { data: 'desc' },
      select: {
        id: true,
        data: true,
        area_irrigada: true,
        volume_agua: true,
        tempo_irrigacao: true,
        cud: true,
        cuc: true,
      },
    });
  }
}
```

---

## 📦 DTOs

### `create-area.dto.ts`
```typescript
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateAreaDto {
  @IsString()
  @IsNotEmpty()
  indentificacao: string;

  @IsNumber()
  @IsNotEmpty()
  area_ha: number;

  @IsString()
  @IsNotEmpty()
  propriedade_id: string;
}
```

### `create-avaliacao.dto.ts`
```typescript
import { IsString, IsNumber, IsBoolean, IsArray, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

class PontoDto {
  @IsNumber()
  eixo_x: number;

  @IsNumber()
  eixo_y: number;

  @IsNumber()
  volume_ml: number;

  @IsNumber()
  tempo_seg: number;

  @IsNumber()
  vazao_l_h: number;
}

export class CreateAvaliacaoDto {
  @IsNumber()
  area_irrigada: number;

  @IsNumber()
  volume_agua: number;

  @IsNumber()
  tempo_irrigacao: number;

  @IsNumber()
  cud: number;

  @IsNumber()
  cuc: number;

  @IsString()
  data: string;

  @IsString()
  unidade_id: string;

  @IsBoolean()
  offline_status: boolean;

  @IsEnum(['SETOR_HIDRAULICO', 'PIVO_CENTRAL'])
  unidade_type: 'SETOR_HIDRAULICO' | 'PIVO_CENTRAL';

  @IsArray()
  @Type(() => PontoDto)
  pontos: PontoDto[];

  @IsString()
  @IsOptional()
  comentarios?: string;

  @IsString()
  @IsOptional()
  recomendacoes?: string;
}
```

---

## 🚀 Comandos para Criar Módulos

```bash
# Criar módulo de Área
cd c:\AVAlia\avalia-irriga-backend
nest g module area
nest g controller area
nest g service area

# Criar módulo de Avaliação
nest g module avaliacao
nest g controller avaliacao
nest g service avaliacao
```

---

## ✅ Checklist de Implementação

- [ ] Criar módulo `Area`
- [ ] Criar `AreaController` com endpoints
- [ ] Criar `AreaService` com lógica
- [ ] Criar `CreateAreaDto`
- [ ] Adicionar rota em `PropertyController` para listar áreas
- [ ] Criar módulo `Avaliacao`
- [ ] Criar `AvaliacaoController` com endpoints
- [ ] Criar `AvaliacaoService` com lógica
- [ ] Criar `CreateAvaliacaoDto` e `PontoDto`
- [ ] Adicionar tratamento de erros
- [ ] Adicionar validações
- [ ] Testar com Swagger/Postman
- [ ] Integrar com frontend

---

## 🧪 Testando os Endpoints

### Com cURL (PowerShell)

```powershell
# Criar área
$body = @{
    indentificacao = "Talhão A"
    area_ha = 15.5
    propriedade_id = "uuid-da-propriedade"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3333/areas" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"; "Authorization"="Bearer seu-token"} `
  -Body $body

# Listar áreas da propriedade
Invoke-RestMethod -Uri "http://localhost:3333/property/uuid-da-propriedade/areas" `
  -Headers @{"Authorization"="Bearer seu-token"}
```

---

**Após implementar estes endpoints, todas as telas criadas funcionarão perfeitamente! 🎉**
