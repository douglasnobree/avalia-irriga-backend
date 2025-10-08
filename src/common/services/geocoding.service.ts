import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GeocodingService {
  /**
   * Busca coordenadas (latitude e longitude) a partir de endereço
   * Usa a API gratuita do OpenStreetMap Nominatim
   */
  async getCoordinatesFromAddress(
    municipio: string,
    estado: string,
  ): Promise<{ latitude: number; longitude: number } | null> {
    try {
      // Construir query de busca
      const query = `${municipio}, ${estado}, Brasil`;
      console.log('🔍 Geocoding API - Query:', query);
      
      // Usar Nominatim (OpenStreetMap) - API gratuita
      const response = await axios.get(
        'https://nominatim.openstreetmap.org/search',
        {
          params: {
            q: query,
            format: 'json',
            limit: 1,
            countrycodes: 'br',
          },
          headers: {
            'User-Agent': 'AVAlia-Irriga-App/1.0',
          },
        },
      );

      console.log('🔍 Geocoding API - Resposta:', response.data.length, 'resultado(s)');

      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        const coords = {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
        };
        console.log('🔍 Geocoding API - Coordenadas:', coords);
        return coords;
      }

      console.log('🔍 Geocoding API - Nenhum resultado encontrado');
      return null;
    } catch (error) {
      console.error('❌ Geocoding API - Erro:', error.message);
      return null;
    }
  }

  /**
   * Validar se as coordenadas estão dentro do Brasil
   */
  isValidBrazilCoordinates(latitude: number, longitude: number): boolean {
    // Brasil: Latitude entre -33° e 5°, Longitude entre -74° e -34°
    return (
      latitude >= -34 &&
      latitude <= 6 &&
      longitude >= -75 &&
      longitude <= -33
    );
  }
}
