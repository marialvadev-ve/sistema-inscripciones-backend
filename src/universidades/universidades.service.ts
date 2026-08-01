import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearUniversidadDto } from './dto/crear-universidad.dto';

@Injectable()
export class UniversidadesService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(dto: CrearUniversidadDto) {
    const existente = await this.prisma.universidad.findUnique({
      where: { nombre: dto.nombre },
    });

    if (existente) {
      throw new ConflictException(`Ya existe una universidad registrada con el nombre '${dto.nombre}'.`);
    }

    return this.prisma.universidad.create({ data: dto });
  }

  async listar() {
    return this.prisma.universidad.findMany({ orderBy: { nombre: 'asc' } });
  }

  async designarAdmin(universidadId: string, usuarioId: string) {
    const universidad = await this.prisma.universidad.findUnique({ where: { id: universidadId } });
    if (!universidad) {
      throw new NotFoundException('La universidad especificada no existe.');
    }

    const usuario = await this.prisma.usuario.findUnique({ where: { id: usuarioId } });
    if (!usuario) {
      throw new NotFoundException('El usuario especificado no existe.');
    }

    const rolAdmin = await this.prisma.rol.findUnique({ where: { nombre: 'ADMIN' } });
    if (!rolAdmin) {
      throw new NotFoundException('El rol ADMIN no está sembrado en el sistema.');
    }

    return this.prisma.usuarioRol.create({
      data: {
        usuarioId,
        rolId: rolAdmin.id,
        universidadId,
      },
    });
  }
}