import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CrearLapsoAcademicoDto } from './dto/crear-lapso-academico.dto';
import { JwtAuthGuard } from '../auth/guardas/jwt-auth.guards';
import { UniversidadAdminGuard } from '../guards/universidad-admin.guard';
import { LapsosAcademicosService } from './lapsos-academicos.service';

@Controller('academico')
@UseGuards(JwtAuthGuard)
export class LapsosAcademicosController {
  constructor(private readonly lapsosAcademicosService: LapsosAcademicosService) {}

  // --- LAPSOS ACADÉMICOS ---

  @Post('lapsos')
  @UseGuards(UniversidadAdminGuard)
  crearLapso(@Body() dto: CrearLapsoAcademicoDto) {
    return this.lapsosAcademicosService.crearLapsoAcademico(dto);
  }

  @Get('lapsos/universidad/:universidadId')
  listarLapsos(@Param('universidadId') universidadId: string) {
    return this.lapsosAcademicosService.listarLapsosPorUniversidad(universidadId);
  }
}