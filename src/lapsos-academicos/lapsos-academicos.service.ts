import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearLapsoAcademicoDto } from './dto/crear-lapso-academico.dto';

@Injectable()
export class LapsosAcademicosService {
  constructor(private readonly prisma: PrismaService) {}
  // --- LAPSOS ACADÉMICOS ---

  async crearLapsoAcademico(dto: CrearLapsoAcademicoDto) {
    // Validamos que la Entrada elegida pertenezca a la MISMA universidad del lapso
    const entrada = await this.prisma.entrada.findUnique({
      where: { id: dto.entradaId },
    });

    if (!entrada) {
      throw new NotFoundException('La entrada especificada no existe.');
    }

    if (entrada.universidadId !== dto.universidadId) {
      throw new BadRequestException('La entrada seleccionada no pertenece a esta universidad.');
    }

    if (new Date(dto.fechaInicio) >= new Date(dto.fechaFin)) {
      throw new BadRequestException('La fecha de inicio debe ser anterior a la fecha de fin.');
    }

    const existente = await this.prisma.lapsoAcademico.findFirst({
      where: { universidadId: dto.universidadId, codigo: dto.codigo },
    });

    if (existente) {
      throw new ConflictException(`Ya existe un lapso académico con el código '${dto.codigo}' en esta universidad.`);
    }

    return this.prisma.lapsoAcademico.create({
      data: {
        universidadId: dto.universidadId,
        entradaId: dto.entradaId,
        codigo: dto.codigo,
        descripcion: dto.descripcion,
        fechaInicio: new Date(dto.fechaInicio),
        fechaFin: new Date(dto.fechaFin),
        tipo: dto.tipo,
      },
      include: { entrada: true },
    });
  }

  async listarLapsosPorUniversidad(universidadId: string) {
    return this.prisma.lapsoAcademico.findMany({
      where: { universidadId, activo: true },
      include: { entrada: true },
      orderBy: { fechaInicio: 'desc' },
    });
  }

  async listarLapsosActivosPorTipo(universidadId: string, tipo: string) {
    const ahora = new Date();
    return this.prisma.lapsoAcademico.findMany({
      where: {
        universidadId,
        activo: true,
        tipo: tipo as any,
        fechaInicio: { lte: ahora },
        fechaFin: { gte: ahora },
      },
      include: { entrada: true },
    });
  }
}
