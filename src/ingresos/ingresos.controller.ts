// src/modulos/ingresos/ingresos.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { IngresosService } from './ingresos.service';
import { JwtAuthGuard } from 'src/auth/guardas/jwt-auth.guards';
import { CrearTipoIngresoDto } from './dto/crear-tipo-ingreso.dto';
import { UniversidadAdminGuard } from 'src/guards/universidad-admin.guard';
import { CrearOrigenIngresoDto } from './dto/crear-origen-ingreso.dto';

@Controller('ingresos')
@UseGuards(JwtAuthGuard)
export class IngresosController {
  constructor(private readonly ingresosService: IngresosService) {}

  // Tipos de Ingreso
  @Post('tipo')
  @UseGuards(UniversidadAdminGuard) // Valida que pertenezca a la universidad del DTO
  async crearTipo(@Body() dto: CrearTipoIngresoDto) {
    return this.ingresosService.crearTipoIngreso(dto);
  }

  @Get('tipo/universidad/:universidadId')
  @UseGuards(UniversidadAdminGuard) // Valida que pertenezca al :universidadId de la ruta
  async listarTipos(@Param('universidadId') universidadId: string) {
    return this.ingresosService.obtenerTiposPorUniversidad(universidadId);
  }

  // Orígenes de Ingreso
  @Post('origen')
  @UseGuards(UniversidadAdminGuard)
  async crearOrigen(@Body() dto: CrearOrigenIngresoDto) {
    return this.ingresosService.crearOrigenIngreso(dto);
  }

  @Get('origen/universidad/:universidadId')
  @UseGuards(UniversidadAdminGuard)
  async listarOrigenes(@Param('universidadId') universidadId: string) {
    return this.ingresosService.obtenerOrigenesPorUniversidad(universidadId);
  }
}
