import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { ImageQueryDto } from './dto/image-query.dto';

/**
 * Servicio para la gestión de imágenes de gatos
 * Consume TheCatAPI para obtener imágenes de gatos
 */
@Injectable()
export class ImagesService {
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
   * Obtiene imágenes de gatos con filtros opcionales
   * @param query - Parámetros de consulta para filtrar imágenes
   * @returns Lista de imágenes de gatos
   */
  async getImages(query?: ImageQueryDto) {
    try {
      const params = new URLSearchParams();
      
      if (query?.breed_id) {
        params.append('breed_id', query.breed_id);
      }
      
      if (query?.page) {
        params.append('page', query.page.toString());
      }
      
      if (query?.limit) {
        params.append('limit', query.limit.toString());
      }
      
      if (query?.size) {
        params.append('size', query.size);
      }
      
      if (query?.mime_types) {
        params.append('mime_types', query.mime_types);
      }

      const url = `${this.baseUrl}/images/search${params.toString() ? `?${params.toString()}` : ''}`;
      
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
        'Error al obtener las imágenes de gatos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene imágenes específicas de una raza por su ID
   * @param breedId - ID de la raza
   * @param limit - Número máximo de imágenes a retornar
   * @returns Lista de imágenes de la raza específica
   */
  async getImagesByBreedId(breedId: string, limit: number = 10) {
    try {
      const params = new URLSearchParams();
      params.append('breed_id', breedId);
      params.append('limit', limit.toString());
      params.append('size', 'medium');

      const url = `${this.baseUrl}/images/search?${params.toString()}`;
      
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
        'Error al obtener las imágenes de la raza',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene una imagen específica por su ID
   * @param imageId - ID de la imagen
   * @returns Información detallada de la imagen
   */
  async getImageById(imageId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/images/${imageId}`, {
          headers: {
            'x-api-key': this.apiKey,
          },
        }),
      );

      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new HttpException(
          'Imagen no encontrada',
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        'Error al obtener la imagen',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
