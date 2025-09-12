import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para consultas de imágenes de gatos
 * Define los parámetros de búsqueda y filtrado de imágenes
 */
export class ImageQueryDto {
  @ApiProperty({
    description: 'ID de la raza para filtrar imágenes',
    example: 'beng',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El breed_id debe ser una cadena de texto' })
  breed_id?: string;

  @ApiProperty({
    description: 'Número de página para paginación',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'La página debe ser un número entero' })
  @Min(1, { message: 'La página debe ser mayor a 0' })
  page?: number;

  @ApiProperty({
    description: 'Número de resultados por página',
    example: 10,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'El límite debe ser un número entero' })
  @Min(1, { message: 'El límite debe ser mayor a 0' })
  @Max(100, { message: 'El límite no puede ser mayor a 100' })
  limit?: number;

  @ApiProperty({
    description: 'Tamaño de la imagen (thumb, small, medium, full)',
    example: 'medium',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El tamaño debe ser una cadena de texto' })
  size?: string;

  @ApiProperty({
    description: 'Tipo de imagen (jpg, png, gif)',
    example: 'jpg',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El tipo debe ser una cadena de texto' })
  mime_types?: string;
}
