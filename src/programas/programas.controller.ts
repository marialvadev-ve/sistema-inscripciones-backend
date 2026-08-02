import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ProgramasService } from './programas.service';
import { CrearProgramaDto } from './dto/crear-programa.dto';
import { JwtAuthGuard } from '../auth/guardas/jwt-auth.guards';
import { UniversidadAdminGuard } from '../guards/universidad-admin.guard';

@Controller('programas')
@UseGuards(JwtAuthGuard)
export class ProgramasController {
  constructor(private readonly programasService: ProgramasService) {}

  @Post()
  @UseGuards(UniversidadAdminGuard)
  crear(@Body() dto: CrearProgramaDto) {
    return this.programasService.crear(dto);
  }

  @Get('universidad/:universidadId')
  listarPorUniversidad(@Param('universidadId') universidadId: string) {
    return this.programasService.listarPorUniversidad(universidadId);
  }
}