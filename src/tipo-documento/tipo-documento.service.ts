import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearTipoDocumentoDto } from './dto/crear-tipo-documento.dto';

@Injectable()
export class TipoDocumentoService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(dto: CrearTipoDocumentoDto) {
    const existente = await this.prisma.tipoDocumento.findFirst({
      where: { universidadId: dto.universidadId, nombre: dto.nombre },
    });

    if (existente) {
      throw new ConflictException(`El tipo de documento '${dto.nombre}' ya existe para esta universidad.`);
    }

    return this.prisma.tipoDocumento.create({
      data: {
        universidadId: dto.universidadId,
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        minImagenes: dto.minImagenes ?? 1,
        maxImagenes: dto.maxImagenes,
        obligatorio: dto.obligatorio ?? true,
        orden: dto.orden ?? 0,
      },
    });
  }

  async listarPorUniversidad(universidadId: string) {
    return this.prisma.tipoDocumento.findMany({
      where: { universidadId, activo: true },
      orderBy: { orden: 'asc' },
    });
  }
}