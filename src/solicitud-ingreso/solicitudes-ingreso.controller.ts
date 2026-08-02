import { Controller, Post, Get, Body, Param, Req, UseGuards, Patch } from '@nestjs/common';
import { CrearSolicitudIngresoDto } from './dto/crear-solicitud-ingreso.dto';
import { JwtAuthGuard } from '../auth/guardas/jwt-auth.guards';
import { OwnerSolicitudGuard } from '../guards/owner-solicitud.guard';
import { SolicitudesIngresoService } from './solicitudes-ingreso.service';
import { ControlEstudiosGuard } from 'src/guards/control-estudios.guard';
import { RechazarSolicitudDto } from './dto/rechazar-solicitud.dto';
import { RevisarDocumentoDto } from './dto/revisar-documento.dto';
import { ConfirmarSolicitudDto } from './dto/confirmar-solicitud.dto';

@Controller('solicitudes-ingreso')
@UseGuards(JwtAuthGuard)
export class SolicitudesIngresoController {
  constructor(private readonly solicitudesService: SolicitudesIngresoService) {}

  @Post()
  crear(@Req() req: any, @Body() dto: CrearSolicitudIngresoDto) {
    return this.solicitudesService.crear(req.user.sub, dto);
  }

  @Get('mias')
  misSolicitudes(@Req() req: any) {
    return this.solicitudesService.misSolicitudes(req.user.sub);
  }

  @Get(':solicitudIngresoId')
  @UseGuards(OwnerSolicitudGuard)
  obtenerUna(@Param('solicitudIngresoId') solicitudIngresoId: string) {
    return this.solicitudesService.obtenerUna(solicitudIngresoId);
  }

  @Get(':solicitudIngresoId/revision')
  @UseGuards(ControlEstudiosGuard)
  obtenerParaRevision(@Param('solicitudIngresoId') solicitudIngresoId: string) {
    return this.solicitudesService.obtenerParaRevision(solicitudIngresoId);
  }

  @Patch('documentos/:solicitudDocumentoId/revisar')
  @UseGuards(ControlEstudiosGuard)
  revisarDocumento(
    @Param('solicitudDocumentoId') solicitudDocumentoId: string,
    @Body() dto: RevisarDocumentoDto,
    @Req() req: any,
  ) {
    return this.solicitudesService.revisarDocumento(solicitudDocumentoId, dto, req.user.sub);
  }

  @Post(':solicitudIngresoId/confirmar')
  @UseGuards(ControlEstudiosGuard)
  confirmar(
    @Param('solicitudIngresoId') solicitudIngresoId: string,
    @Body() dto: ConfirmarSolicitudDto,
    @Req() req: any,
  ) {
    return this.solicitudesService.confirmar(solicitudIngresoId, dto, req.user.sub);
  }

  @Post(':solicitudIngresoId/rechazar')
  @UseGuards(ControlEstudiosGuard)
  rechazar(@Param('solicitudIngresoId') solicitudIngresoId: string, @Body() dto: RechazarSolicitudDto) {
    return this.solicitudesService.rechazar(solicitudIngresoId, dto.motivo);
  }
}