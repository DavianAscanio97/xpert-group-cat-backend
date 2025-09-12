import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AuthService } from '@/auth/auth.service';
import { LoginUserDto } from '@/users/dto/login-user.dto';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { AuthResponseDto } from '@/auth/dto/auth-response.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

/**
 * Controlador de autenticación
 * Maneja las rutas de login, registro y perfil de usuario
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Autentica un usuario existente
   * @param loginUserDto - Credenciales de login
   * @returns Token JWT y información del usuario
   */
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  async login(@Body() loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
    return this.authService.login(loginUserDto);
  }

  /**
   * Registra un nuevo usuario
   * @param createUserDto - Datos del usuario a registrar
   * @returns Token JWT y información del usuario
   */
  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'El usuario con este email ya existe',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  async register(@Body() createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    return this.authService.register(createUserDto);
  }

  /**
   * Obtiene el perfil del usuario autenticado
   * @param req - Request object con información del usuario
   * @returns Información del usuario autenticado
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Perfil obtenido exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  getProfile(@Request() req) {
    return req.user;
  }
}
