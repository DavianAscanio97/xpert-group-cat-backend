import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * Función principal que inicializa la aplicación NestJS
 * Configura pipes de validación, CORS, Swagger y puerto de escucha
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS
  app.enableCors({
    origin: [
      'http://localhost',
      'http://localhost:4200',
      'http://127.0.0.1',
      'http://127.0.0.1:4200',
      // Permitir cualquier puerto de localhost en desarrollo
      /^http:\/\/localhost(\:\d+)?$/,
      /^http:\/\/127\.0\.0\.1(\:\d+)?$/,
      // Permitir dominios de Vercel
      /^https:\/\/.*\.vercel\.app$/,
      /^https:\/\/.*\.vercel\.dev$/
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With',
      'Accept',
      'Origin'
    ],
    credentials: true,
  });

  // Configurar pipe de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Cats API')
    .setDescription('API para gestión de gatos usando TheCatAPI')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
}

bootstrap();
