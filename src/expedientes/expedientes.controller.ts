import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ExpedientesService } from './expedientes.service';
import { CreateExpedienteDto } from './dto/create-expediente.dto';

@Controller('expedientes')
export class ExpedientesController {
  constructor(private readonly expedientesService: ExpedientesService) {}

  // Endpoint 1: El estudiante pide la URL para subir directamente a MinIO
  @Post('presigned-upload-url')
  async getUploadUrl(@Body() dto: CreateExpedienteDto) {
    return this.expedientesService.obtenerUrlSubida(dto);
  }

  // Endpoint 2: El estudiante avisa que la subida finalizó para guardar el registro en Postgres
  @Post('confirmar-subida')
  async confirmUpload(@Body() body: { solicitudIngresoId: string; filePath: string }) {
    return this.expedientesService.confirmarSubida(body.solicitudIngresoId, body.filePath);
  }

  // Endpoint 3: El funcionario pide ver el expediente (genera enlace fresco al instante)
  @Get('view/:solicitudIngresoId')
  async getViewUrl(@Param('solicitudIngresoId') solicitudIngresoId: string) {
    return this.expedientesService.obtenerUrlVisualizacion(solicitudIngresoId);
  }
}