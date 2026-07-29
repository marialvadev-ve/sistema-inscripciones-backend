import { Injectable, CanActivate, ExecutionContext, 
    NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OwnerSolicitudGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Extraído previamente por el JwtAuthGuard
    const body = request.body;
    const params = request.params;

    // El ID de la solicitud puede venir en los parámetros de la URL (ej: /expedientes/:id) 
    // o en el cuerpo de la petición (ej: solicitudIngresoId)
    const solicitudId = params.id || params.solicitudId || body.solicitudIngresoId;

    if (!solicitudId) {
      throw new NotFoundException('No se proporcionó el ID de la solicitud de ingreso');
    }

    // Buscamos la solicitud en la base de datos
    const solicitud = await this.prisma.solicitudIngreso.findUnique({
      where: { id: solicitudId },
      select: { id: true, usuarioId: true },
    });

    if (!solicitud) {
      throw new NotFoundException('La solicitud de ingreso no existe');
    }

    // Si el usuario es ADMIN o CONTROL_ESTUDIOS (puedes validar por roles en el token), se le permite el paso.
    // Si es un ASPIRANTE común, validamos estrictamente que sea el dueño de la solicitud.
    const esPersonalAutorizado = user.roles?.includes('ADMIN') || user.roles?.includes('CONTROL_ESTUDIOS');

    if (!esPersonalAutorizado && solicitud.usuarioId !== user.sub) {
      throw new ForbiddenException('No tienes permisos para modificar o acceder a esta solicitud ajena');
    }

    return true;
  }
}