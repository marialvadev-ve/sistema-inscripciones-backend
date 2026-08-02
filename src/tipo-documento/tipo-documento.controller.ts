import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { TipoDocumentoService } from './tipo-documento.service';
import { CrearTipoDocumentoDto } from './dto/crear-tipo-documento.dto';
import { JwtAuthGuard } from '../auth/guardas/jwt-auth.guards';
import { UniversidadAdminGuard } from '../guards/universidad-admin.guard';

@Controller('tipos-documento')
@UseGuards(JwtAuthGuard)
export class TipoDocumentoController {
  constructor(private readonly tipoDocumentoService: TipoDocumentoService) {}

  @Post()
  @UseGuards(UniversidadAdminGuard)
  crear(@Body() dto: CrearTipoDocumentoDto) {
    return this.tipoDocumentoService.crear(dto);
  }

  @Get('universidad/:universidadId')
  listarPorUniversidad(@Param('universidadId') universidadId: string) {
    return this.tipoDocumentoService.listarPorUniversidad(universidadId);
  }
}