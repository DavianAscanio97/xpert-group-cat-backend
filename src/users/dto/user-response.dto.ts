import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para la respuesta de usuario
 * Define la estructura de datos que se retorna al cliente (sin información sensible)
 */
export class UserResponseDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  name: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Estado activo del usuario',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Fecha de creación del usuario',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del usuario',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}
