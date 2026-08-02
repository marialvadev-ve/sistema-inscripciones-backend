import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ControlEstudiosGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const universidadId = await this.resolverUniversidadId(request.params);

    if (!universidadId) {
      throw new NotFoundException('No se pudo determinar la universidad asociada a este recurso.');
    }

    const esSuperAdmin = user.roles?.some((r: any) => r.nombre === 'SUPER_ADMIN');
    const esAutorizado = user.roles?.some(
      (r: any) => (r.nombre === 'ADMIN' || r.nombre === 'CONTROL_ESTUDIOS') && r.universidadId === universidadId,
    );

    if (!esSuperAdmin && !esAutorizado) {
      throw new ForbiddenException('Solo el personal de Control de Estudios de esta universidad puede realizar esta acción.');
    }

    request.universidadId = universidadId;
    return true;
  }

  // Detecta desde qué parámetro de la ruta debe llegar a la universidad, según el endpoint
  private async resolverUniversidadId(params: any): Promise<string | null> {
    // Caso 1: la ruta trae directo el ID de la solicitud (ej. /:solicitudIngresoId/confirmar)
    if (params.solicitudIngresoId) {
      const solicitud = await this.prisma.solicitudIngreso.findUnique({
        where: { id: params.solicitudIngresoId },
        select: { especialidad: { select: { universidadId: true } } },
      });
      return solicitud?.especialidad.universidadId ?? null;
    }

    // Caso 2: la ruta trae el ID de un SolicitudDocumento (ej. /documentos/:solicitudDocumentoId/revisar)
    if (params.solicitudDocumentoId) {
      const solicitudDocumento = await this.prisma.solicitudDocumento.findUnique({
        where: { id: params.solicitudDocumentoId },
        select: {
          solicitud: {
            select: { especialidad: { select: { universidadId: true } } },
          },
        },
      });
      return solicitudDocumento?.solicitud.especialidad.universidadId ?? null;
    }

    return null;
  }
}