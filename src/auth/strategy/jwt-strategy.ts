import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'tu_clave_secreta_aqui',
    });
  }

  async validate(payload: any) {
    // Lo que retornes aquí se inyecta automáticamente en request.user
    return { 
      sub: payload.sub, 
      email: payload.email, 
      roles: payload.roles, 
      universidades: payload.universidades 
    };
  }
}