export class CreatePropertyDto {
    nome: string;
    proprietario: string;
    telefone: string;
    email: string;
    municipio: string;
    estado: string;
    latitude: number;
    longitude: number;
    area_total: number;
    area_irrigada: number;
    observacoes?: string;
    UserId: number;
}
