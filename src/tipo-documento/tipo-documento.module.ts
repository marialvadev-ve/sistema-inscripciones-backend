import { Module } from '@nestjs/common';
import { TipoDocumentoService } from './tipo-documento.service';
import { TipoDocumentoController } from './tipo-documento.controller';

@Module({
  providers: [TipoDocumentoService],
  controllers: [TipoDocumentoController]
})
export class TipoDocumentoModule {}
