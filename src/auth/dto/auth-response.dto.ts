import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para la respuesta de autenticación
 * Contiene el token JWT y la información del usuario
 */
export class AuthResponseDto {
  @ApiProperty({
    description: 'Token JWT para autenticación',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Información del usuario autenticado',
  })
  user: {
    _id: string;
    name: string;
    email: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}
