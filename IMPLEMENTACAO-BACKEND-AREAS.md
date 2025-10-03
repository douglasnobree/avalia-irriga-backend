# Guia de Implementação Backend - Endpoint de Criação de Área

## 📍 Endpoint Necessário

```
POST /areas
```

## 📥 Payload Recebido

O frontend envia um objeto com dois níveis:
1. **`area`** - Dados da Unidade_avaliada
2. **`setor_hidraulico`** OU **`pivo_central`** - Dados técnicos do sistema

### Exemplo Setor Hidráulico:
```json
{
  "area": {
    "indentificacao": "Setor 1 - Bananal",
    "area_ha": 10.5,
    "propriedade_id": "uuid-da-propriedade"
  },
  "setor_hidraulico": {
    "fabricante": "Netafim",
    "modelo": "UniRam",
    "vazao_nominal": 2.5,
    "pressao_trabalho": 10,
    "pressao_recomendada": 12,
    "dist_emissores": 0.5,
    "dist_laterais": 1.5,
    "filtro_tipo": "Tela",
    "malha_filtro": "130 mesh",
    "pressao_entrada": 15,
    "valvula_tipo": "Elétrica",
    "energia_tipo": "Elétrica",
    "condicoes_gerais": "Sistema em boas condições",
    "num_emissores": 1000,
    "freq_manutencao": "Semanal",
    "data_ultima_manutencao": "2025-09-15T00:00:00.000Z",
    "emissor_type": "GOTEJAMENTO",
    "tipo_setor": "SETOR_HIDRAULICO"
  }
}
```

### Exemplo Pivô Central:
```json
{
  "area": {
    "indentificacao": "Pivô 01 - Milho Leste",
    "area_ha": 50.0,
    "propriedade_id": "uuid-da-propriedade"
  },
  "pivo_central": {
    "num_torres": 5,
    "comprimento": 380,
    "fabricante": "Valley",
    "modelo": "8000",
    "emissor_type": "MICROMICROASPERSOR",
    "energia_tipo": "Elétrica trifásica",
    "potencia_motor": 125,
    "vazao_operacao": 150,
    "controle_tipo": "Painel Digital",
    "fertirrigacao": true,
    "fonte_hidrica": "Poço profundo",
    "tempo_funcionamento": 18,
    "velocidade": 100,
    "bocal_tipo": "Spray",
    "pressao_bocal": 20,
    "data_ultima_manutencao": "2025-08-01T00:00:00.000Z",
    "freq_manutencao": "Mensal",
    "problemas_observados": "Nenhum",
    "data_ultima_avaliacoes": "2025-09-01T00:00:00.000Z"
  }
}
```

---

## 🏗️ Implementação Sugerida

### 1. Criar o DTO

**`src/property/dto/create-area.dto.ts`**

```typescript
import { EmissorType, UnitModel } from '@prisma/client';

class UnidadeAvaliadaDto {
  indentificacao: string;
  area_ha: number;
  propriedade_id: string;
}

class SetorHidraulicoDto {
  fabricante: string;
  modelo: string;
  vazao_nominal: number;
  pressao_trabalho: number;
  pressao_recomendada: number;
  dist_emissores: number;
  dist_laterais: number;
  filtro_tipo: string;
  malha_filtro: string;
  pressao_entrada: number;
  valvula_tipo: string;
  energia_tipo: string;
  condicoes_gerais: string;
  num_emissores: number;
  freq_manutencao: string;
  data_ultima_manutencao: Date;
  emissor_type: EmissorType;
  tipo_setor: UnitModel;
}

class PivoCentralDto {
  num_torres: number;
  comprimento: number;
  fabricante: string;
  modelo: string;
  emissor_type: EmissorType;
  energia_tipo: string;
  potencia_motor: number;
  vazao_operacao: number;
  controle_tipo: string;
  fertirrigacao: boolean;
  fonte_hidrica: string;
  tempo_funcionamento: number;
  velocidade: number;
  bocal_tipo: string;
  pressao_bocal: number;
  data_ultima_manutencao: Date;
  freq_manutencao: string;
  problemas_observados?: string;
  data_ultima_avaliacoes: Date;
}

export class CreateAreaDto {
  area: UnidadeAvaliadaDto;
  setor_hidraulico?: SetorHidraulicoDto;
  pivo_central?: PivoCentralDto;
}
```

---

### 2. Implementar o Controller

**`src/property/property.controller.ts`**

```typescript
import { Controller, Post, Body, UseGuards, Session } from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreateAreaDto } from './dto/create-area.dto';

@Controller('areas')
@UseGuards(AuthGuard) // Ajuste conforme seu guard de autenticação
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  async createArea(
    @Body() createAreaDto: CreateAreaDto,
    @Session() session: any,
  ) {
    const userId = session.user.id; // Ajuste conforme sua sessão
    return this.propertyService.createArea(createAreaDto, userId);
  }
}
```

---

### 3. Implementar o Service

**`src/property/property.service.ts`**

```typescript
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../infra/prisma/prisma.service';
import { CreateAreaDto } from './dto/create-area.dto';

@Injectable()
export class PropertyService {
  constructor(private prisma: PrismaService) {}

  async createArea(dto: CreateAreaDto, userId: string) {
    try {
      // 1. Verificar se a propriedade existe e pertence ao usuário/organização
      const propriedade = await this.prisma.propriedade.findUnique({
        where: { id: dto.area.propriedade_id },
      });

      if (!propriedade) {
        throw new BadRequestException('Propriedade não encontrada');
      }

      // 2. Criar a Unidade_avaliada
      const unidadeAvaliada = await this.prisma.unidade_avaliada.create({
        data: {
          indentificacao: dto.area.indentificacao,
          area_ha: dto.area.area_ha,
          propriedade_id: dto.area.propriedade_id,
        },
      });

      // 3. Criar o Setor Hidráulico (se fornecido)
      if (dto.setor_hidraulico) {
        await this.prisma.setor_Hidraulico.create({
          data: {
            ...dto.setor_hidraulico,
            userId,
            data_ultima_manutencao: new Date(dto.setor_hidraulico.data_ultima_manutencao),
          },
        });
      }

      // 4. Criar o Pivô Central (se fornecido)
      if (dto.pivo_central) {
        await this.prisma.pivo_Central.create({
          data: {
            ...dto.pivo_central,
            data_ultima_manutencao: new Date(dto.pivo_central.data_ultima_manutencao),
            data_ultima_avaliacoes: new Date(dto.pivo_central.data_ultima_avaliacoes),
          },
        });
      }

      return {
        success: true,
        message: 'Área criada com sucesso',
        data: {
          id: unidadeAvaliada.id,
          indentificacao: unidadeAvaliada.indentificacao,
        },
      };
    } catch (error) {
      console.error('Erro ao criar área:', error);
      throw new BadRequestException('Erro ao criar área: ' + error.message);
    }
  }
}
```

---

## 🔗 Relação com o Prisma Schema

### Problema Atual no Schema:
Olhando o schema Prisma, vejo que **falta uma relação direta** entre:
- `Unidade_avaliada` ↔️ `Setor_Hidraulico`
- `Unidade_avaliada` ↔️ `Pivo_Central`

### Solução 1: Adicionar campos de relação (RECOMENDADO)

Modifique o `schema.prisma`:

```prisma
model Unidade_avaliada {
  id             String      @id @default(uuid())
  indentificacao String
  area_ha        Float
  propriedade_id String
  
  // ADICIONAR ESTES CAMPOS:
  setor_id       String?     @unique
  pivo_id        String?     @unique
  
  avaliacoes     Avaliacao[]
  propiedade     Propriedade @relation(fields: [propriedade_id], references: [id], onDelete: Cascade)
  
  // ADICIONAR ESTAS RELAÇÕES:
  setor          Setor_Hidraulico? @relation(fields: [setor_id], references: [id])
  pivo           Pivo_Central?     @relation(fields: [pivo_id], references: [id])
}

model Setor_Hidraulico {
  id                     String             @id @default(uuid())
  // ... outros campos
  
  // ADICIONAR:
  unidade                Unidade_avaliada?
}

model Pivo_Central {
  id                     String       @id @default(uuid())
  // ... outros campos
  
  // ADICIONAR:
  unidade                Unidade_avaliada?
}
```

Depois rode:
```bash
npx prisma migrate dev --name add_area_relations
```

### Solução 2: Usar o modelo atual (ALTERNATIVA)

Se não quiser modificar o schema, você pode:

1. Armazenar a relação através da `Avaliacao`
2. Criar a área primeiro
3. Quando criar a primeira avaliação, vincular ao setor/pivô

---

## 🧪 Testando o Endpoint

### Com cURL (Setor Hidráulico):
```bash
curl -X POST http://localhost:3333/areas \
  -H "Content-Type: application/json" \
  -H "Cookie: session=..." \
  -d '{
    "area": {
      "indentificacao": "Setor 1 - Test",
      "area_ha": 10.5,
      "propriedade_id": "uuid-aqui"
    },
    "setor_hidraulico": {
      "fabricante": "Netafim",
      "modelo": "Test",
      "vazao_nominal": 2.5,
      "pressao_trabalho": 10,
      "pressao_recomendada": 12,
      "dist_emissores": 0.5,
      "dist_laterais": 1.5,
      "filtro_tipo": "Tela",
      "malha_filtro": "130 mesh",
      "pressao_entrada": 15,
      "valvula_tipo": "Manual",
      "energia_tipo": "Elétrica",
      "condicoes_gerais": "OK",
      "num_emissores": 100,
      "freq_manutencao": "Semanal",
      "data_ultima_manutencao": "2025-01-01T00:00:00.000Z",
      "emissor_type": "GOTEJAMENTO",
      "tipo_setor": "SETOR_HIDRAULICO"
    }
  }'
```

---

## ⚠️ Pontos de Atenção

1. **Autenticação**: Certifique-se de que o guard de autenticação está funcionando
2. **Validação**: Adicione `class-validator` decorators nos DTOs
3. **Permissões**: Verificar se o usuário tem permissão na organização da propriedade
4. **Transações**: Use Prisma transactions para garantir atomicidade:

```typescript
await this.prisma.$transaction(async (tx) => {
  const area = await tx.unidade_avaliada.create({ ... });
  if (dto.setor_hidraulico) {
    await tx.setor_Hidraulico.create({ ... });
  }
});
```

5. **Datas**: Converter strings ISO para Date objects
6. **Enums**: Validar que `emissor_type` e `tipo_setor` são valores válidos do enum

---

## 📚 Dependências Necessárias

```bash
npm install class-validator class-transformer
```

Para validação adicional nos DTOs:

```typescript
import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';

export class SetorHidraulicoDto {
  @IsString()
  fabricante: string;
  
  @IsNumber()
  vazao_nominal: number;
  
  @IsEnum(EmissorType)
  emissor_type: EmissorType;
  
  // etc...
}
```

---

## 🎯 Resultado Esperado

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Área criada com sucesso",
  "data": {
    "id": "uuid-da-area-criada",
    "indentificacao": "Setor 1 - Bananal"
  }
}
```

**Resposta de Erro (400):**
```json
{
  "statusCode": 400,
  "message": "Propriedade não encontrada",
  "error": "Bad Request"
}
```

---

Com isso, seu backend estará pronto para receber e processar a criação de áreas completas com todos os dados técnicos! 🚀
