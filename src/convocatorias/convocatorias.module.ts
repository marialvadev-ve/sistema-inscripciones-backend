import { Module } from '@nestjs/common';
import { ConvocatoriasService } from './convocatorias.service';
import { ConvocatoriasController } from './convocatorias.controller';

@Module({
  providers: [ConvocatoriasService],
  controllers: [ConvocatoriasController]
})
export class ConvocatoriasModule {}
