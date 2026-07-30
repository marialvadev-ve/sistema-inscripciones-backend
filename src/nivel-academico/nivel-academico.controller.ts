// src/modulos/niveles-academicos/nivel-academico.controller.ts
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { NivelAcademicoService } from './nivel-academico.service';
import { CrearNivelAcademicoDto } from './dto/crear-nivel-academico.dto';
import { JwtAuthGuard } from 'src/auth/guardas/jwt-auth.guards';
import { SuperAdminGuard } from 'src/guards/super-admin.guard';

@Controller('niveles-academicos')
@UseGuards(JwtAuthGuard) // Exige estar logueado
export class NivelAcademicoController {
  constructor(private readonly nivelAcademicoService: NivelAcademicoService) {}

  @Get()
  async listar() {
    return this.nivelAcademicoService.obtenerTodos();
  }

  @Post()
  @UseGuards(SuperAdminGuard) // Solo Super Admin puede crear niveles académicos globales
  async crear(@Body() dto: CrearNivelAcademicoDto) {
    return this.nivelAcademicoService.crear(dto);
  }
}