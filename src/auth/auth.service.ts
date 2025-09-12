import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

/**
 * Servicio de autenticación
 * Maneja el login, registro y generación de tokens JWT
 */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Autentica un usuario y genera un token JWT
   * @param loginUserDto - Credenciales de login
   * @returns Token JWT y información del usuario
   */
  async login(loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
    const user = await this.usersService.validateUser(loginUserDto);
    
    const payload = { 
      email: user.email, 
      sub: user._id 
    };
    
    const access_token = this.jwtService.sign(payload);
    
    return {
      access_token,
      user,
    };
  }

  /**
   * Registra un nuevo usuario y genera un token JWT
   * @param createUserDto - Datos del usuario a registrar
   * @returns Token JWT y información del usuario
   */
  async register(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    const user = await this.usersService.create(createUserDto);
    
    const payload = { 
      email: user.email, 
      sub: user._id 
    };
    
    const access_token = this.jwtService.sign(payload);
    
    return {
      access_token,
      user,
    };
  }
}
