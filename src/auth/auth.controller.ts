import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistroUsuarioDto } from './dto/registro-usuario.dto';

@Controller('auth')
export class AuthController {
  // Inyectamos el servicio para poder usar sus funciones
  constructor(private readonly authService: AuthService) {}

  @Post('registrar')
  registrar(@Body() dto: RegistroUsuarioDto) {
    // Aquí recibimos el JSON validado y se lo pasamos a la lógica de negocio
    return this.authService.registrar(dto);
  }
}
