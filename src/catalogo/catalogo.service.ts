import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CrearTipoDocumentoDto } from './dto/crear-tipo-documento.dto';
import { CrearProgramaDto } from './dto/crear-programa.dto';

@Injectable()
export class CatalogoService {
    constructor(private readonly prismaService: PrismaService){}

    async crearTipoDocumento(dto: CrearTipoDocumentoDto){
        //validar duplicidad por universidad usando el indice unico del shema.
        const existeTipoDocumento = await this.prismaService.tipoDocumento.findFirst({
            where: {
                universidadId: dto.universidadId,
                nombre: dto.nombre
            }
        });

        if (existeTipoDocumento) {
            const nombre = dto.nombre;
            throw new ConflictException(`El tipo de documento ${ nombre } ya existe para esta universidad.`);
        }

        return this.prismaService.tipoDocumento.create({
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

    async obtenerTiposDocumentoPorUniversidad(universidadId: string) {
        return this.prismaService.tipoDocumento.findMany({
            where: { universidadId, activo: true },
            orderBy: { orden: 'asc' },
        });
    }

    // Añadir a CatalogoService existente
  
  /**
   * Obtiene todos los niveles académicos globales (ej. Pregrado, Postgrado).
   */
  async obtenerNivelesAcademicos() {
    return this.prismaService.nivelAcademico.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  /**
   * Crea un programa de formación vinculado a una universidad y nivel académico.
   */
  async crearProgramaFormacion(dto: CrearProgramaDto) {
    // Validar código único global o por institución según diseño (aquí el schema lo define como @unique global)
    const programaExistente = await this.prismaService.programaFormacion.findUnique({
      where: { codigo: dto.codigo },
    });

    if (programaExistente) {
      throw new ConflictException(`Ya existe un programa registrado con el código '${dto.codigo}'.`);
    }

    return this.prismaService.programaFormacion.create({
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

  /**
   * Lista los programas de formación activos de una universidad específica.
   */
  async obtenerProgramasPorUniversidad(universidadId: string) {
    return this.prismaService.programaFormacion.findMany({
      where: { universidadId, activo: true },
      include: { nivelAcademico: true },
      orderBy: { nombre: 'asc' },
    });
  }
}
