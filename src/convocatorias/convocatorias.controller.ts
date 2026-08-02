import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ConvocatoriasService } from './convocatorias.service';
import { CrearConvocatoriaDto } from './dto/crear-convocatoria.dto';
import { JwtAuthGuard } from '../auth/guardas/jwt-auth.guards';
import { UniversidadAdminGuard } from '../guards/universidad-admin.guard';

@Controller('convocatorias')
@UseGuards(JwtAuthGuard)
export class ConvocatoriasController {
  constructor(private readonly convocatoriasService: ConvocatoriasService) {}

  @Post()
  @UseGuards(UniversidadAdminGuard)
  crear(@Body() dto: CrearConvocatoriaDto) {
    return this.convocatoriasService.crear(dto);
  }

  @Get('universidad/:universidadId')
  listarPorUniversidad(@Param('universidadId') universidadId: string) {
    return this.convocatoriasService.listarPorUniversidad(universidadId);
  }
}