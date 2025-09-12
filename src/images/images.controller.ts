import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

import { ImagesService } from './images.service';
import { ImageQueryDto } from './dto/image-query.dto';

/**
 * Controlador para la gestión de imágenes de gatos
 * Maneja las rutas HTTP relacionadas con imágenes de gatos
 */
@ApiTags('images')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  /**
   * Obtiene imágenes de gatos con filtros opcionales
   * @param query - Parámetros de consulta para filtrar imágenes
   * @returns Lista de imágenes de gatos
   */
  @Get()
  @ApiOperation({ summary: 'Obtener imágenes de gatos con filtros' })
  @ApiQuery({ name: 'breed_id', required: false, description: 'ID de la raza' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Límite de resultados' })
  @ApiQuery({ name: 'size', required: false, description: 'Tamaño de la imagen' })
  @ApiQuery({ name: 'mime_types', required: false, description: 'Tipo de imagen' })
  @ApiResponse({
    status: 200,
    description: 'Lista de imágenes obtenida exitosamente',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async getImages(@Query() query: ImageQueryDto) {
    return this.imagesService.getImages(query);
  }

  /**
   * Obtiene imágenes específicas de una raza por su ID
   * @param breedId - ID de la raza
   * @param limit - Número máximo de imágenes
   * @returns Lista de imágenes de la raza específica
   */
  @Get('bybreedid')
  @ApiOperation({ summary: 'Obtener imágenes por ID de raza' })
  @ApiQuery({ name: 'breed_id', required: true, description: 'ID de la raza' })
  @ApiQuery({ name: 'limit', required: false, description: 'Límite de resultados' })
  @ApiResponse({
    status: 200,
    description: 'Imágenes de la raza obtenidas exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'ID de raza requerido',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async getImagesByBreedId(
    @Query('breed_id') breedId: string,
    @Query('limit') limit?: number,
  ) {
    if (!breedId) {
      throw new Error('breed_id es requerido');
    }
    
    return this.imagesService.getImagesByBreedId(breedId, limit);
  }

  /**
   * Obtiene una imagen específica por su ID
   * @param imageId - ID de la imagen
   * @returns Información detallada de la imagen
   */
  @Get(':imageId')
  @ApiOperation({ summary: 'Obtener una imagen específica por ID' })
  @ApiParam({ name: 'imageId', description: 'ID de la imagen' })
  @ApiResponse({
    status: 200,
    description: 'Imagen encontrada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Imagen no encontrada',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async getImageById(@Param('imageId') imageId: string) {
    return this.imagesService.getImageById(imageId);
  }
}
