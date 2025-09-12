const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');

let app;

async function createApp() {
  if (!app) {
    try {
      // Importar el módulo compilado
      const { AppModule } = require('../dist/app.module');
      
      app = await NestFactory.create(AppModule);
      
      // Configurar CORS
      app.enableCors({
        origin: true, // Permitir todos los orígenes
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: [
          'Content-Type', 
          'Authorization', 
          'X-Requested-With',
          'Accept',
          'Origin',
          'Access-Control-Allow-Origin',
          'Access-Control-Allow-Headers',
          'Access-Control-Allow-Methods'
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

      await app.init();
    } catch (error) {
      console.error('Error creating app:', error);
      throw error;
    }
  }
  return app;
}

module.exports = async (req, res) => {
  try {
    const app = await createApp();
    const handler = app.getHttpAdapter().getInstance();
    return handler(req, res);
  } catch (error) {
    console.error('Error in serverless function:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
