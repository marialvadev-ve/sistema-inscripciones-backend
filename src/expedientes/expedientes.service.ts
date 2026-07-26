import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MinioService } from '../minio/minio.service';
import { CreateExpedienteDto } from './dto/create-expediente.dto';

@Injectable()
export class ExpedientesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly minioService: MinioService,
  ) {}

  // 1. Generar la URL presignada para que el estudiante suba directo a MinIO
  async obtenerUrlSubida(dto: CreateExpedienteDto) {
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

    const universidad = solicitud.especialidad.universidad.siglas || 'UPTAEB';
    const especialidad = solicitud.especialidad.nombre;
    const lapsoAcademico = solicitud.convocatoria.nombre;
    const cedula = solicitud.usuario?.persona?.cedula || 'sincedula';
    const tipoDocumento = 'expedientenuevoingreso';

    // Llamamos a tu método existente en MinioService que calcula la ruta y la URL de subida
    const { uploadUrl, filePath } = await this.minioService.getPresignedUploadUrl(
      universidad,
      especialidad,
      lapsoAcademico,
      cedula,
      tipoDocumento,
    );

    return {
      uploadUrl,
      filePath,
      message: 'URL de subida generada con éxito.',
    };
  }

  // 2. Confirmar que el archivo subió a MinIO y guardarlo en la base de datos
  async confirmarSubida(solicitudIngresoId: string, filePath: string) {
    const bucketName = 'expedientes-universidad'; // El bucket de tu MinioService
    const fileUrl = `${bucketName}/${filePath}`;

    const expedienteGuardado = await this.prisma.expediente.upsert({
      where: { solicitudIngresoId },
      update: { fileUrl },
      create: {
        solicitudIngresoId,
        fileUrl,
      },
    });

    return {
      message: 'Expediente registrado exitosamente en el sistema.',
      expediente: expedienteGuardado,
    };
  }

  // 3. Generar enlace de visualización en caliente para el funcionario (Transparente y sin errores de expiración)
  async obtenerUrlVisualizacion(solicitudIngresoId: string) {
    const expediente = await this.prisma.expediente.findUnique({
      where: { solicitudIngresoId },
    });

    if (!expediente || !expediente.fileUrl) {
      throw new NotFoundException('No se encontró un expediente asociado a esta solicitud.');
    }

    // Extraemos la ruta limpia removiendo el nombre del bucket del inicio de fileUrl
    const filePath = expediente.fileUrl.substring(expediente.fileUrl.indexOf('/') + 1);

    // Generamos un enlace fresco de 10 minutos al vuelo
    const viewUrl = await this.minioService.getPresignedViewUrl(filePath);

    return {
      viewUrl,
      message: 'Enlace de visualización generado con éxito.',
    };
  }
}