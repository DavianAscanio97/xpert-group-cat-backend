import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * Controlador principal de la aplicación
 * Maneja las rutas raíz y de health check
 */
@ApiTags('App')
@Controller()
export class AppController {
  
  /**
   * Endpoint principal en la ruta raíz
   * @returns Objeto con información del estado de la aplicación
   */
  @Get()
  @ApiOperation({ 
    summary: 'Información principal de la API',
    description: 'Retorna información sobre el estado actual de la aplicación en la ruta raíz'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'API funcionando correctamente',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        message: { type: 'string', example: 'Cats API is running' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        environment: { type: 'string', example: 'production' },
        version: { type: 'string', example: '1.0.0' },
        endpoints: {
          type: 'object',
          properties: {
            swagger: { type: 'string', example: '/api' },
            health: { type: 'string', example: '/health' },
            cats: { type: 'string', example: '/cats' },
            images: { type: 'string', example: '/images' },
            auth: { type: 'string', example: '/auth' },
            users: { type: 'string', example: '/users' }
          }
        }
      }
    }
  })
  getRoot() {
    return {
      status: 'ok',
      message: 'Cats API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      endpoints: {
        swagger: '/api',
        health: '/health',
        cats: '/cats',
        images: '/images',
        auth: '/auth',
        users: '/users'
      }
    };
  }

  /**
   * Endpoint de health check
   * @returns Objeto con información del estado de la aplicación
   */
  @Get('health')
  @ApiOperation({ 
    summary: 'Health check de la API',
    description: 'Endpoint para verificar el estado de salud de la API'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'API funcionando correctamente'
  })
  getHealth() {
    return {
      status: 'ok',
      message: 'Cats API is healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    };
  }
}
