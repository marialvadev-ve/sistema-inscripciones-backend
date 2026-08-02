import { Module } from '@nestjs/common';
import { LapsosAcademicosService } from './lapsos-academicos.service';
import { LapsosAcademicosController } from './lapsos-academicos.controller';

@Module({
  providers: [LapsosAcademicosService],
  controllers: [LapsosAcademicosController]
})
export class LapsosAcademicosModule {}
