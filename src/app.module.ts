import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AppController } from './app.controller';
import { CatsModule } from './cats/cats.module';
import { ImagesModule } from './images/images.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

/**
 * Módulo principal de la aplicación
 * Configura todos los módulos necesarios, base de datos y autenticación
 */
@Module({
  controllers: [AppController],
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Configuración de MongoDB
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/cats-api'),
    
    // Configuración de JWT
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
    }),
    
    // Configuración de Passport
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    // Módulos de la aplicación
    CatsModule,
    ImagesModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
