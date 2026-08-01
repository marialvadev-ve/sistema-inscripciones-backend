import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UniversidadesService } from './universidades.service';
import { CrearUniversidadDto } from './dto/crear-universidad.dto';
import { DesignarAdminDto } from './dto/designar-admin.dto';
import { JwtAuthGuard } from '../auth/guardas/jwt-auth.guards';
import { SuperAdminGuard } from '../guards/super-admin.guard';

@Controller('universidades')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class UniversidadesController {
  constructor(private readonly universidadesService: UniversidadesService) {}

  @Get()
  listar() {
    return this.universidadesService.listar();
  }

  @Post()
  crear(@Body() dto: CrearUniversidadDto) {
    return this.universidadesService.crear(dto);
  }

  @Post(':universidadId/administradores')
  designarAdmin(@Param('universidadId') universidadId: string, @Body() dto: DesignarAdminDto) {
    return this.universidadesService.designarAdmin(universidadId, dto.usuarioId);
  }
}