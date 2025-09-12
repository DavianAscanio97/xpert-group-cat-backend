import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { BreedQueryDto } from '@/cats/dto/breed-query.dto';

/**
 * Servicio para la gestión de razas de gatos
 * Consume TheCatAPI para obtener información sobre razas de gatos
 */
@Injectable()
export class CatsService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('THECAT_API_KEY') || '';
    this.baseUrl = this.configService.get<string>('THECAT_API_BASE_URL') || 'https://api.thecatapi.com/v1';
  }

  /**
   * Obtiene todas las razas de gatos disponibles
   * @param query - Parámetros de consulta opcionales
   * @returns Lista de razas de gatos
   */
  async getBreeds(query?: BreedQueryDto) {
    try {
      const params = new URLSearchParams();
      
      if (query?.q) {
        params.append('q', query.q);
      }
      
      if (query?.page) {
        params.append('page', query.page.toString());
      }
      
      if (query?.limit) {
        params.append('limit', query.limit.toString());
      }

      const url = `${this.baseUrl}/breeds${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'x-api-key': this.apiKey,
          },
        }),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        'Error al obtener las razas de gatos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene una raza específica por su ID
   * @param breedId - ID de la raza
   * @returns Información de la raza específica
   */
  async getBreedById(breedId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/breeds/${breedId}`, {
          headers: {
            'x-api-key': this.apiKey,
          },
        }),
      );

      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new HttpException(
          'Raza de gato no encontrada',
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        'Error al obtener la raza de gato',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Busca razas de gatos por término de búsqueda
   * @param searchTerm - Término de búsqueda
   * @returns Lista de razas que coinciden con la búsqueda
   */
  async searchBreeds(searchTerm: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/breeds/search?q=${encodeURIComponent(searchTerm)}`, {
          headers: {
            'x-api-key': this.apiKey,
          },
        }),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        'Error al buscar razas de gatos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
