import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt-strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'tu_clave_secreta_super_segura59350d1f428a095dd1bb5228b8756f5aa2',
      signOptions: { expiresIn: '15m' }, // Token de corta duración como acordamos
    }),
  ],

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // <-- Aquí se registra la estrategia
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
