import { Module } from '@nestjs/common';
import { NivelAcademicoController } from './nivel-academico.controller';
import { NivelAcademicoService } from './nivel-academico.service';

@Module({
  controllers: [NivelAcademicoController],
  providers: [NivelAcademicoService]
})
export class NivelAcademicoModule {}
