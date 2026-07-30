import { Injectable, CanActivate, ExecutionContext, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class UniversidadAdminGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const usuario = request.user;

    if (!usuario) {
      throw new ForbiddenException('Acceso no autorizado.');
    }

    // 1. Extraer el universidadId de la petición (puede venir en params, body o query)
    const universidadId = 
      request.params?.universidadId || 
      request.body?.universidadId || 
      request.query?.universidadId;

    if (!universidadId) {
      throw new BadRequestException('El ID de la universidad es obligatorio para validar el acceso.');
    }

    // 2. Si el usuario es Super Admin global, permitimos el paso directamente
    const esSuperAdmin = usuario.roles?.some((r: any) => r.rol.nombre === 'SUPER_ADMIN');
    if (esSuperAdmin) {
      return true;
    }

    // 3. Verificar si el usuario está asociado a esta universidad específica
    const asociacion = await this.prisma.usuarioUniversidad.findUnique({
      where: {
        usuarioId_universidadId: {
          usuarioId: usuario.id,
          universidadId: universidadId,
        },
      },
    });

    if (!asociacion) {
      throw new ForbiddenException('No tienes permisos de administración sobre esta universidad.');
    }

    return true;
  }
}