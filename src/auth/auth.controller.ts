import { Controller, Post, Body, Get, Param, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegistroUsuarioDto } from './dto/registro-usuario.dto';
import { LoginDto } from './dto/login.dto'; // <-- Asegúrate de importar el DTO de login

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registrar')
  registrar(@Body() dto: RegistroUsuarioDto) {
    // Aquí recibimos el JSON validado y se lo pasamos a la lógica de negocio
    return this.authService.registrar(dto);
  }

  @Get('verificar/:token')
  verificarEmail(@Param('token') token: string) {
    return this.authService.verificarEmail(token);
  }
  
  @Throttle({ default: { limit: 15, ttl: 60000 } }) // Protegido contra fuerza bruta en redes compartidas
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    // Llamamos al servicio para validar credenciales y generar tokens
    const resultado = await this.authService.login(loginDto);

    // Guardamos el Refresh Token en una Cookie HttpOnly ultra segura (Protección contra XSS)
    response.cookie('refresh_token', resultado.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días de vigencia
    });

    // Retornamos el Access Token de corta duración y los datos del usuario al frontend
    return {
      access_token: resultado.access_token,
      usuario: resultado.usuario,
    };
  }
}