import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearPersonaDto } from './dto/crear-persona.dto';

@Injectable()
export class PersonasService {
  constructor(private readonly prisma: PrismaService) {}

  async crearOActualizarMiCenso(usuarioId: string, dto: CrearPersonaDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    const datosPersona = {
      ...dto,
      fechaNacimiento: new Date(dto.fechaNacimiento),
    };

    // Si ya tiene una Persona vinculada, actualizamos esa misma.
    // Si no, creamos una nueva y la vinculamos al Usuario en la misma operación.
    if (usuario.personaId) {
      return this.prisma.persona.update({
        where: { id: usuario.personaId },
        data: datosPersona,
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const nuevaPersona = await tx.persona.create({ data: datosPersona });

      await tx.usuario.update({
        where: { id: usuarioId },
        data: { personaId: nuevaPersona.id },
      });

      return nuevaPersona;
    });
  }

  async obtenerMiCenso(usuarioId: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      include: { persona: true },
    });

    if (!usuario?.persona) {
      throw new NotFoundException('Aún no has completado tu censo.');
    }

    return usuario.persona;
  }
}
