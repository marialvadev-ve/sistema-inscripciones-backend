import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearConvocatoriaDto } from './dto/crear-convocatoria.dto';

@Injectable()
export class ConvocatoriasService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(dto: CrearConvocatoriaDto) {
    if (new Date(dto.fechaInicio) >= new Date(dto.fechaFin)) {
      throw new BadRequestException('La fecha de inicio debe ser anterior a la fecha de fin.');
    }

    const existente = await this.prisma.convocatoriaIngreso.findFirst({
      where: { universidadId: dto.universidadId, nombre: dto.nombre },
    });

    if (existente) {
      throw new ConflictException(`Ya existe una convocatoria con el nombre '${dto.nombre}' en esta universidad.`);
    }

    return this.prisma.convocatoriaIngreso.create({
      data: {
        universidadId: dto.universidadId,
        nombre: dto.nombre,
        fechaInicio: new Date(dto.fechaInicio),
        fechaFin: new Date(dto.fechaFin),
        activa: dto.activa ?? true,
      },
    });
  }

  async listarPorUniversidad(universidadId: string) {
    return this.prisma.convocatoriaIngreso.findMany({
      where: { universidadId },
      orderBy: { fechaInicio: 'desc' },
    });
  }
}