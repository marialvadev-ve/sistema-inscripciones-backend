import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ZonasGeograficasService } from './zonas-geograficas.service';
import { CrearEstadoDto, CrearMunicipioDto, CrearPaisDto, CrearParroquiaDto } from './dto/geografia.dto';
import { JwtAuthGuard } from 'src/auth/guardas/jwt-auth.guards';
import { SuperAdminGuard } from 'src/guards/super-admin.guard';

@Controller('zonas-geograficas')
@UseGuards(JwtAuthGuard)
export class ZonasGeograficasController {
  constructor(private readonly geografiaService: ZonasGeograficasService) {}

  @Get('paises')
  async listarPaises() {
    return this.geografiaService.obtenerPaises();
  }

  @Get('paises/:paisId/estados')
  async listarEstados(@Param('paisId') paisId: string) {
    return this.geografiaService.obtenerEstadosPorPais(paisId);
  }

  @Get('estados/:estadoId/municipios')
  async listarMunicipios(@Param('estadoId') estadoId: string) {
    return this.geografiaService.obtenerMunicipiosPorEstado(estadoId);
  }

  @Get('municipios/:municipioId/parroquias')
  async listarParroquias(@Param('municipioId') municipioId: string) {
    return this.geografiaService.obtenerParroquiasPorMunicipio(municipioId);
  }

  @Post('pais')
  @UseGuards(SuperAdminGuard)
  async crearPais(@Body() dto: CrearPaisDto) {
    return this.geografiaService.crearPais(dto);
  }

  @Post('estado')
  @UseGuards(SuperAdminGuard)
  async crearEstado(@Body() dto: CrearEstadoDto) {
    return this.geografiaService.crearEstado(dto);
  }

  @Post('municipio')
  @UseGuards(SuperAdminGuard)
  async crearMunicipio(@Body() dto: CrearMunicipioDto) {
    return this.geografiaService.crearMunicipio(dto);
  }

  @Post('parroquia')
  @UseGuards(SuperAdminGuard)
  async crearParroquia(@Body() dto: CrearParroquiaDto) {
    return this.geografiaService.crearParroquia(dto);
  }
}