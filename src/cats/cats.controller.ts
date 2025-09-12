import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

import { CatsService } from './cats.service';
import { BreedQueryDto } from './dto/breed-query.dto';

/**
 * Controlador para la gestión de razas de gatos
 * Maneja las rutas HTTP relacionadas con razas de gatos
 */
@ApiTags('cats')
@Controller('breeds')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  /**
   * Obtiene todas las razas de gatos disponibles
   * @param query - Parámetros de consulta opcionales
   * @returns Lista de razas de gatos
   */
  @Get()
  @ApiOperation({ summary: 'Obtener todas las razas de gatos' })
  @ApiQuery({ name: 'q', required: false, description: 'Término de búsqueda' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Límite de resultados' })
  @ApiResponse({
    status: 200,
    description: 'Lista de razas obtenida exitosamente',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async getBreeds(@Query() query: BreedQueryDto) {
    return this.catsService.getBreeds(query);
  }

  /**
   * Obtiene una raza específica por su ID
   * @param breedId - ID de la raza
   * @returns Información de la raza específica
   */
  @Get(':breed_id')
  @ApiOperation({ summary: 'Obtener una raza específica por ID' })
  @ApiParam({ name: 'breed_id', description: 'ID de la raza de gato' })
  @ApiResponse({
    status: 200,
    description: 'Raza encontrada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Raza no encontrada',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async getBreedById(@Param('breed_id') breedId: string) {
    return this.catsService.getBreedById(breedId);
  }

  /**
   * Busca razas de gatos por término de búsqueda
   * @param searchTerm - Término de búsqueda
   * @returns Lista de razas que coinciden con la búsqueda
   */
  @Get('search/:searchTerm')
  @ApiOperation({ summary: 'Buscar razas de gatos por término' })
  @ApiParam({ name: 'searchTerm', description: 'Término de búsqueda' })
  @ApiResponse({
    status: 200,
    description: 'Búsqueda realizada exitosamente',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async searchBreeds(@Param('searchTerm') searchTerm: string) {
    return this.catsService.searchBreeds(searchTerm);
  }
}
