import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CatalogoService } from './catalogo.service';
import { CrearTipoDocumentoDto } from './dto/crear-tipo-documento.dto';
import { JwtAuthGuard } from 'src/auth/guardas/jwt-auth.guards';
import { CrearProgramaDto } from './dto/crear-programa.dto';
import { UniversidadAdminGuard } from 'src/guards/universidad-admin.guard';

@Controller('catalogos')
@UseGuards(JwtAuthGuard) // Asegura que todas las rutas requieran autenticación por token
export class CatalogoController {
  constructor(private readonly catalogoService: CatalogoService) {}

  @Post('tipo-documento')
  @UseGuards(UniversidadAdminGuard)
  async crearTipoDocumento(@Body() dto: CrearTipoDocumentoDto) {
    return this.catalogoService.crearTipoDocumento(dto);
  }

  @Get('tipos-documento/universidad/:universidadId')
  @UseGuards(UniversidadAdminGuard) // Valida que pertenezca a la universidad del DTO
  async listarTiposDocumento(@Param('universidadId') universidadId: string) {
    return this.catalogoService.obtenerTiposDocumentoPorUniversidad(universidadId);
  }

  @Get('niveles-academicos')
  @UseGuards(UniversidadAdminGuard) // Valida que pertenezca a la universidad del DTO
  async listarNivelesAcademicos() {
    return this.catalogoService.obtenerNivelesAcademicos();
  }
  
  @Post('programa-formacion')
  @UseGuards(UniversidadAdminGuard) // Valida que pertenezca a la universidad del DTO
  async crearProgramaFormacion(@Body() dto: CrearProgramaDto) {
    return this.catalogoService.crearProgramaFormacion(dto);
  }

  @Get('programas/universidad/:universidadId')
  @UseGuards(UniversidadAdminGuard) // Valida que pertenezca a la universidad del DTO
  async listarProgramasPorUniversidad(@Param('universidadId') universidadId: string) {
    return this.catalogoService.obtenerProgramasPorUniversidad(universidadId);
  }
}