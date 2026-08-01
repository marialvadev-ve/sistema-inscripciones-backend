import { Controller, Post, Body, Get, Param, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegistroUsuarioDto } from './dto/registro-usuario.dto';
import { SolicitarResetDto } from 'src/email/dto/solicitar-reset.dto';
import { ResetearPasswordDto } from 'src/email/dto/resetear-password.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registrar')
  registrar(@Body() dto: RegistroUsuarioDto) {
    return this.authService.registrar(dto);
  }

  @Get('verificar/:token')
  verificarEmail(@Param('token') token: string) {
    return this.authService.verificarEmail(token);
  }

  @Throttle({ default: { limit: 15, ttl: 60000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const resultado = await this.authService.login(loginDto);

    response.cookie('refresh_token', resultado.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      access_token: resultado.access_token,
      usuario: resultado.usuario,
    };
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('solicitar-reset')
  @HttpCode(HttpStatus.OK)
  solicitarReset(@Body() dto: SolicitarResetDto) {
    return this.authService.solicitarReset(dto);
  }

  @Post('resetear-password')
  @HttpCode(HttpStatus.OK)
  resetearPassword(@Body() dto: ResetearPasswordDto) {
    return this.authService.resetearPassword(dto);
  }
}