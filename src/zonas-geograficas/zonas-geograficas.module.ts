import { Module } from '@nestjs/common';
import { ZonasGeograficasController } from './zonas-geograficas.controller';
import { ZonasGeograficasService } from './zonas-geograficas.service';

@Module({
  controllers: [ZonasGeograficasController],
  providers: [ZonasGeograficasService],
  exports: [ZonasGeograficasService],
})
export class ZonasGeograficasModule {}
