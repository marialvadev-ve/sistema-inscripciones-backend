import { Injectable, CanActivate, ExecutionContext, ForbiddenException, BadRequestException } from '@nestjs/common';

@Injectable()
export class UniversidadAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const usuario = request.user;

    if (!usuario) {
      throw new ForbiddenException('Acceso no autorizado.');
    }

    const universidadId =
      request.params?.universidadId ||
      request.body?.universidadId ||
      request.query?.universidadId;

    if (!universidadId) {
      throw new BadRequestException('El ID de la universidad es obligatorio para validar el acceso.');
    }

    const esSuperAdmin = usuario.roles?.some((r: any) => r.nombre === 'SUPER_ADMIN');
    if (esSuperAdmin) {
      return true;
    }

    const esAdminDeEstaUniversidad = usuario.roles?.some(
      (r: any) => r.nombre === 'ADMIN' && r.universidadId === universidadId,
    );

    if (!esAdminDeEstaUniversidad) {
      throw new ForbiddenException('No tienes permisos de administración sobre esta universidad.');
    }

    return true;
  }
}