import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { PersonasService } from './personas.service';
import { CrearPersonaDto } from './dto/crear-persona.dto';
import { JwtAuthGuard } from 'src/auth/guardas/jwt-auth.guards';

@Controller('personas')
@UseGuards(JwtAuthGuard)
export class PersonasController {
  constructor(private readonly personasService: PersonasService) {}

  @Post('mi-censo')
  crearOActualizar(@Req() req: any, @Body() dto: CrearPersonaDto) {
    return this.personasService.crearOActualizarMiCenso(req.user.sub, dto);
  }

  @Get('mi-censo')
  obtenerMiCenso(@Req() req: any) {
    return this.personasService.obtenerMiCenso(req.user.sub);
  }
}