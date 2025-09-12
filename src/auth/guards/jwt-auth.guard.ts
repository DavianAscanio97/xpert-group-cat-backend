import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard JWT para proteger rutas
 * Verifica la validez del token JWT en las peticiones
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
