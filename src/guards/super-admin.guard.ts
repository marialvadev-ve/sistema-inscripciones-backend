import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const usuario = request.user;

    if (!usuario || !usuario.roles) {
      throw new ForbiddenException('Acceso denegado. No se encontraron credenciales de usuario.');
    }

    const esSuperAdmin = usuario.roles?.some((r: any) => r.nombre === 'SUPER_ADMIN');

    if (!esSuperAdmin) {
      throw new ForbiddenException('Se requieren privilegios de Super Administrador para realizar esta acción.');
    }

    return true;
  }
}