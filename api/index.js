const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');

let app;

async function createApp() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    
    // Configurar CORS
    app.enableCors({
      origin: [
        'http://localhost',
        'http://localhost:4200',
        'http://127.0.0.1',
        'http://127.0.0.1:4200',
        /^http:\/\/localhost(\:\d+)?$/,
        /^http:\/\/127\.0\.0\.1(\:\d+)?$/,
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
    const { ValidationPipe } = require('@nestjs/common');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Configurar Swagger
    const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');
    const config = new DocumentBuilder()
      .setTitle('Cats API')
      .setDescription('API para gestión de gatos usando TheCatAPI')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.init();
  }
  return app;
}

module.exports = async (req, res) => {
  const app = await createApp();
  const handler = app.getHttpAdapter().getInstance();
  return handler(req, res);
};
