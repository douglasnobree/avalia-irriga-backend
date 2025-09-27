import { ApiProperty } from '@nestjs/swagger';
import { EmissorType } from '../dto/create-hydraulic-sector.dto';

export class HydraulicSector {
    @ApiProperty({
        description: 'Identificador único do setor hidráulico',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    id: string;

    @ApiProperty({
        description: 'Nome do fabricante do setor hidráulico',
        example: 'Irrigação Tech'
    })
    fabricante: string;

    @ApiProperty({
        description: 'Modelo do setor hidráulico',
        example: 'Modelo XYZ-2000'
    })
    modelo: string;

    @ApiProperty({
        description: 'Vazão nominal do sistema em m³/h',
        example: 10.5
    })
    vazao_nominal: number;

    @ApiProperty({
        description: 'Pressão de trabalho em kgf/cm²',
        example: 3.5
    })
    pressao_trabalho: number;

    @ApiProperty({
        description: 'Pressão recomendada pelo fabricante em kgf/cm²',
        example: 4.0
    })
    pressao_recomendada: number;

    @ApiProperty({
        description: 'Distância entre emissores em metros',
        example: 0.5
    })
    dist_emissores: number;

    @ApiProperty({
        description: 'Distância entre laterais em metros',
        example: 2.0
    })
    dist_laterais: number;

    @ApiProperty({
        description: 'Tipo de filtro utilizado',
        example: 'Disco'
    })
    filtro_tipo: string;

    @ApiProperty({
        description: 'Malha do filtro utilizado (medida em mesh)',
        example: '120 mesh'
    })
    malha_filtro: string;

    @ApiProperty({
        description: 'Pressão na entrada do sistema em kgf/cm²',
        example: 5.0
    })
    pressao_entrada: number;

    @ApiProperty({
        description: 'Tipo de válvula utilizada',
        example: 'Automática'
    })
    valvula_tipo: string;

    @ApiProperty({
        description: 'Tipo de energia utilizada',
        example: 'Elétrica'
    })
    energia_tipo: string;

    @ApiProperty({
        description: 'Condições gerais do sistema',
        example: 'Boas condições'
    })
    condicoes_gerais: string;

    @ApiProperty({
        description: 'Número de emissores no sistema',
        example: 50
    })
    num_emissores: number;

    @ApiProperty({
        description: 'Frequência de manutenção',
        example: 'Mensal'
    })
    freq_manutencao: string;

    @ApiProperty({
        description: 'Data da última manutenção',
        example: '2025-09-20T10:00:00Z'
    })
    data_ultima_manutencao: Date;

    @ApiProperty({
        description: 'Tipo de emissor utilizado',
        enum: EmissorType,
        example: EmissorType.GOTEJAMENTO
    })
    emissor_type: EmissorType;
}