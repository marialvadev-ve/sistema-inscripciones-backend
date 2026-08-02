import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearProgramaDto } from './dto/crear-programa.dto';

@Injectable()
export class ProgramasService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(dto: CrearProgramaDto) {
    const existente = await this.prisma.programaFormacion.findFirst({
      where: { universidadId: dto.universidadId, codigo: dto.codigo },
    });

    if (existente) {
      throw new ConflictException(`Ya existe un programa con el código '${dto.codigo}' en esta universidad.`);
    }

    return this.prisma.programaFormacion.create({
      data: {
        codigo: dto.codigo,
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        nivelAcademicoId: dto.nivelAcademicoId,
        universidadId: dto.universidadId,
        activo: dto.activo ?? true,
      },
      include: {
        nivelAcademico: true,
        universidad: true,
      },
    });
  }

  async listarPorUniversidad(universidadId: string) {
    return this.prisma.programaFormacion.findMany({
      where: { universidadId, activo: true },
      include: { nivelAcademico: true },
      orderBy: { nombre: 'asc' },
    });
  }
}
