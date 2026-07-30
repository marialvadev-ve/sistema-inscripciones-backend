import { Injectable, CanActivate, ExecutionContext,
    NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OwnerSolicitudGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const body = request.body;
    const params = request.params;

    const solicitudId = params.id || params.solicitudId || params.solicitudIngresoId || body?.solicitudIngresoId;

    if (!solicitudId) {
      throw new NotFoundException('No se proporcionó el ID de la solicitud de ingreso');
    }

    const solicitud = await this.prisma.solicitudIngreso.findUnique({
      where: { id: solicitudId },
      select: {
        id: true,
        usuarioId: true,
        especialidad: { select: { universidadId: true } },
      },
    });

    if (!solicitud) {
      throw new NotFoundException('La solicitud de ingreso no existe');
    }

    const esAdminGlobal = user.roles?.some((r: any) => r.nombre === 'ADMIN' && r.universidadId === null);
    const esControlDeEstaUniversidad = user.roles?.some(
      (r: any) => r.nombre === 'CONTROL_ESTUDIOS' && r.universidadId === solicitud.especialidad.universidadId,
    );

    const esPersonalAutorizado = esAdminGlobal || esControlDeEstaUniversidad;

    if (!esPersonalAutorizado && solicitud.usuarioId !== user.sub) {
      throw new ForbiddenException('No tienes permisos para modificar o acceder a esta solicitud ajena');
    }

    return true;
  }
}