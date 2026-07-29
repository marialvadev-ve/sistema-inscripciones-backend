import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MinioService } from '../minio/minio.service';
import { SolicitarUrlSubidaDto } from './dto/solicitar-url-subido.dto';

@Injectable()
export class ExpedientesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly minioService: MinioService,
  ) {}

  // 1. Generar la URL presignada para subir UNA imagen de UN tipo de documento
  async obtenerUrlSubida(dto: SolicitarUrlSubidaDto) {
    const solicitud = await this.prisma.solicitudIngreso.findUnique({
      where: { id: dto.solicitudIngresoId },
      include: {
        usuario: { include: { persona: true } },
        especialidad: { include: { universidad: true } },
        convocatoria: true,
      },
    });

    if (!solicitud) {
      throw new NotFoundException('La solicitud de ingreso especificada no existe.');
    }

    const tipoDocumento = await this.prisma.tipoDocumento.findUnique({
      where: { id: dto.tipoDocumentoId },
    });

    if (!tipoDocumento) {
      throw new NotFoundException('El tipo de documento especificado no existe.');
    }

    // Verificamos que no se exceda el máximo de imágenes permitido para este tipo de documento
    if (tipoDocumento.maxImagenes && dto.orden > tipoDocumento.maxImagenes) {
      throw new BadRequestException(
        `Este documento admite máximo ${tipoDocumento.maxImagenes} imagen(es).`,
      );
    }

    const uni = solicitud.especialidad.universidad.siglas.trim().toUpperCase();
    const esp = solicitud.especialidad.nombre.trim().toLowerCase().replace(/\s+/g, '-');
    const lapso = solicitud.convocatoria.nombre.trim();
    const cedula = solicitud.usuario?.persona?.cedula || 'sin-cedula';
    const tipoSlug = tipoDocumento.nombre.trim().toLowerCase().replace(/\s+/g, '-');

    const filePath = `${uni}/${esp}/${lapso}/${cedula}/${tipoSlug}/${dto.orden}.${dto.extension}`;

    const uploadUrl = await this.minioService.getPresignedUploadUrl(filePath);

    return {
      uploadUrl,
      filePath,
      message: 'URL de subida generada con éxito.',
    };
  }

  // 2. Confirmar que una imagen específica ya se subió, y registrarla
  async confirmarSubida(solicitudIngresoId: string, tipoDocumentoId: string, filePath: string, orden: number) {
    const tipoDocumento = await this.prisma.tipoDocumento.findUnique({
      where: { id: tipoDocumentoId },
    });

    if (!tipoDocumento) {
      throw new NotFoundException('El tipo de documento especificado no existe.');
    }

    // Buscamos o creamos el "contenedor" de este tipo de documento para esta solicitud
    const solicitudDocumento = await this.prisma.solicitudDocumento.upsert({
      where: {
        solicitudId_tipoDocumentoId: {
          solicitudId: solicitudIngresoId,
          tipoDocumentoId,
        },
      },
      update: {},
      create: {
        solicitudId: solicitudIngresoId,
        tipoDocumentoId,
      },
    });

    // Registramos la imagen puntual (esta página/foto específica)
    await this.prisma.documentoImagen.create({
      data: {
        solicitudDocumentoId: solicitudDocumento.id,
        key: filePath,
        orden,
      },
    });

    // Si ya se alcanzó el mínimo de imágenes requeridas, marcamos el documento como SUBIDO
    const totalImagenes = await this.prisma.documentoImagen.count({
      where: { solicitudDocumentoId: solicitudDocumento.id },
    });

    if (totalImagenes >= tipoDocumento.minImagenes) {
      await this.prisma.solicitudDocumento.update({
        where: { id: solicitudDocumento.id },
        data: { estado: 'SUBIDO' },
      });
    }

    return { message: 'Documento registrado exitosamente.' };
  }

  // 3. El funcionario ve TODO el expediente: cada tipo de documento con todas sus imágenes
  async obtenerExpedienteCompleto(solicitudIngresoId: string) {
    const documentos = await this.prisma.solicitudDocumento.findMany({
      where: { solicitudId: solicitudIngresoId },
      include: {
        tipoDocumento: true,
        imagenes: { orderBy: { orden: 'asc' } },
      },
    });

    if (documentos.length === 0) {
      throw new NotFoundException('No se encontraron documentos para esta solicitud.');
    }

    // Generamos una URL de visualización fresca para cada imagen, todas al mismo tiempo
    const documentosConUrls = await Promise.all(
      documentos.map(async (doc) => ({
        tipoDocumento: doc.tipoDocumento.nombre,
        estado: doc.estado,
        imagenes: await Promise.all(
          doc.imagenes.map(async (img) => ({
            orden: img.orden,
            viewUrl: await this.minioService.getPresignedViewUrl(img.key),
          })),
        ),
      })),
    );

    return { documentos: documentosConUrls };
  }
}