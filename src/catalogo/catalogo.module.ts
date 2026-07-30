import { Module } from '@nestjs/common';
import { CatalogoService } from './catalogo.service';
import { CatalogoController } from './catalogo.controller';
import { UniversidadAdminGuard } from 'src/guards/universidad-admin.guard';

@Module({
  providers: [
    CatalogoService,
    UniversidadAdminGuard, // <-- Registramos el guard aquí para que NestJS pueda inyectar PrismaService en él
  ],
  controllers: [CatalogoController],
  exports: [CatalogoService], // (Opcional) Por si otro módulo necesita consumir este servicio más adelante
})
export class CatalogoModule {}