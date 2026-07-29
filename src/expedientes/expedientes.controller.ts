import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ExpedientesService } from './expedientes.service';
import { SolicitarUrlSubidaDto } from './dto/solicitar-url-subido.dto';
import { OwnerSolicitudGuard } from 'src/guards/owner-solicitud.guard';
import { JwtAuthGuard } from 'src/auth/guardas/jwt-auth.guards';


@Controller('expedientes')
@UseGuards(JwtAuthGuard) // Primero valida que esté logueado globalmente en el controlador
export class ExpedientesController {
  constructor(private readonly expedientesService: ExpedientesService) {}

  // Endpoint 1: El estudiante pide la URL para subir directamente a MinIO
  // Protegido con OwnerSolicitudGuard para asegurar que el DTO incluya una solicitud propia
  @Post('presigned-upload-url')
  @UseGuards(OwnerSolicitudGuard)
  async getUploadUrl(@Body() dto: SolicitarUrlSubidaDto) {
    return this.expedientesService.obtenerUrlSubida(dto);
  }

  // Endpoint 2: El estudiante avisa que la subida finalizó para guardar el registro en Postgres
  // Protegido con OwnerSolicitudGuard validando el body.solicitudIngresoId
  @Post('confirmar-subida')
  @UseGuards(OwnerSolicitudGuard)
  async confirmUpload(
    @Body() body: { solicitudIngresoId: string; tipoDocumentoId: string; filePath: string; orden: number },
  ) {
    return this.expedientesService.confirmarSubida(
      body.solicitudIngresoId,
      body.tipoDocumentoId,
      body.filePath,
      body.orden,
    );
  }

  // Endpoint 3: El funcionario o estudiante pide ver el expediente (genera enlace fresco al instante)
  // Protegido con OwnerSolicitudGuard validando el parámetro de la URL (:solicitudIngresoId)
  @Get('ver/:solicitudIngresoId')
  @UseGuards(OwnerSolicitudGuard)
  async getExpedienteCompleto(@Param('solicitudIngresoId') solicitudIngresoId: string) {
    return this.expedientesService.obtenerExpedienteCompleto(solicitudIngresoId);
  }
}