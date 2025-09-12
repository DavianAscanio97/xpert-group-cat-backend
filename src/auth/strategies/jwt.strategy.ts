import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '../../users/users.service';

/**
 * Estrategia JWT para autenticación
 * Valida tokens JWT y extrae información del usuario
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
    });
  }

  /**
   * Valida el payload del token JWT
   * @param payload - Payload del token JWT
   * @returns Usuario autenticado
   */
  async validate(payload: any) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Token inválido');
    }
    return { userId: payload.sub, email: payload.email };
  }
}
