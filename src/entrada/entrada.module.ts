import { Module } from '@nestjs/common';
import { EntradaService } from './entrada.service';
import { EntradaController } from './entrada.controller';

@Module({
  providers: [EntradaService],
  controllers: [EntradaController]
})
export class EntradaModule {}
