import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

/**
 * Módulo de gatos
 * Configura el controlador y servicio para la gestión de razas de gatos
 */
@Module({
  imports: [HttpModule],
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
