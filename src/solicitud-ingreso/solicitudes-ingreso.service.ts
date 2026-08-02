import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearSolicitudIngresoDto } from './dto/crear-solicitud-ingreso.dto';
import { RevisarDocumentoDto } from './dto/revisar-documento.dto';
import { MinioService } from 'src/minio/minio.service';
import { ConfirmarSolicitudDto } from './dto/confirmar-solicitud.dto';

@Injectable()
export class SolicitudesIngresoService {
  constructor(private readonly prisma: PrismaService, 
    private readonly minioService: MinioService) {}

  async crear(usuarioId: string, dto: CrearSolicitudIngresoDto) {
    // 1. El aspirante debe haber completado su censo antes de poder aplicar
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { personaId: true, emailVerificado: true },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    if (!usuario.emailVerificado) {
      throw new BadRequestException('Debes verificar tu correo electrónico antes de continuar.');
    }
    if (!usuario.personaId) {
      throw new BadRequestException('Debes completar tu censo (datos personales) antes de crear una solicitud.');
    }

    // 2. La especialidad determina la universidad "de referencia" para toda la solicitud
    const especialidad = await this.prisma.programaFormacion.findUnique({
      where: { id: dto.especialidadId },
    });

    if (!especialidad || !especialidad.activo) {
      throw new NotFoundException('El programa de formación especificado no existe o no está activo.');
    }

    const universidadId = especialidad.universidadId;

    // 3. Validamos que convocatoria, origen y tipoIngreso pertenezcan a ESA MISMA universidad
    //    (evita mezclar catálogos de universidades distintas en una misma solicitud)
    const convocatoria = await this.prisma.convocatoriaIngreso.findUnique({
      where: { id: dto.convocatoriaId },
    });

    if (!convocatoria || convocatoria.universidadId !== universidadId) {
      throw new BadRequestException('La convocatoria no pertenece a la misma universidad del programa seleccionado.');
    }

    const ahora = new Date();
    if (!convocatoria.activa || ahora < convocatoria.fechaInicio || ahora > convocatoria.fechaFin) {
      throw new BadRequestException('Esta convocatoria no está activa actualmente.');
    }

    const origen = await this.prisma.origenIngreso.findUnique({
      where: { id: dto.origenId },
    });

    if (!origen || origen.universidadId !== universidadId) {
      throw new BadRequestException('El origen de ingreso no pertenece a la misma universidad del programa seleccionado.');
    }

    const tipoIngreso = await this.prisma.tipoIngreso.findUnique({
      where: { id: dto.tipoIngresoId },
    });

    if (!tipoIngreso || tipoIngreso.universidadId !== universidadId) {
      throw new BadRequestException('El tipo de ingreso no pertenece a la misma universidad del programa seleccionado.');
    }

    // 4. Evitamos que el mismo usuario aplique dos veces a la misma convocatoria
    const solicitudExistente = await this.prisma.solicitudIngreso.findFirst({
      where: {
        usuarioId,
        convocatoriaId: dto.convocatoriaId,
        estado: { notIn: ['RECHAZADA', 'ANULADA'] },
      },
    });

    if (solicitudExistente) {
      throw new ConflictException('Ya tienes una solicitud activa para esta convocatoria.');
    }

    // 5. Todo válido: creamos la solicitud
    return this.prisma.solicitudIngreso.create({
      data: {
        usuarioId,
        convocatoriaId: dto.convocatoriaId,
        origenId: dto.origenId,
        tipoIngresoId: dto.tipoIngresoId,
        especialidadId: dto.especialidadId,
      },
      include: {
        convocatoria: true,
        origen: true,
        tipoIngreso: true,
        especialidad: { include: { universidad: true, nivelAcademico: true } },
      },
    });
  }

  async misSolicitudes(usuarioId: string) {
    return this.prisma.solicitudIngreso.findMany({
      where: { usuarioId },
      include: {
        convocatoria: true,
        especialidad: { include: { universidad: true } },
        documentos: { include: { tipoDocumento: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async obtenerUna(solicitudId: string) {
    const solicitud = await this.prisma.solicitudIngreso.findUnique({
      where: { id: solicitudId },
      include: {
        usuario: { include: { persona: true } },
        convocatoria: true,
        origen: true,
        tipoIngreso: true,
        especialidad: { include: { universidad: true, nivelAcademico: true } },
        documentos: { include: { tipoDocumento: true, imagenes: true } },
      },
    });

    if (!solicitud) {
      throw new NotFoundException('La solicitud especificada no existe.');
    }

    return solicitud;
  }

  // Vista optimizada para la revisión presencial: solo lo que el funcionario necesita ver
  async obtenerParaRevision(solicitudId: string) {
    const solicitud = await this.prisma.solicitudIngreso.findUnique({
      where: { id: solicitudId },
      include: {
        usuario: { include: { persona: true } },
        especialidad: { include: { universidad: true, nivelAcademico: true } },
        convocatoria: true,
        origen: true,
        tipoIngreso: true,
        documentos: {
          include: {
            tipoDocumento: true,
            imagenes: { orderBy: { orden: 'asc' } },
          },
        },
      },
    });

    if (!solicitud) {
      throw new NotFoundException('La solicitud no existe.');
    }

    // Generamos las URLs de visualización SOLO al momento de la revisión, no antes
    const documentosConUrls = await Promise.all(
      solicitud.documentos.map(async (doc) => ({
        id: doc.id,
        tipoDocumento: doc.tipoDocumento.nombre,
        estado: doc.estado,
        observacion: doc.observacion,
        imagenes: await Promise.all(
          doc.imagenes.map(async (img) => ({
            orden: img.orden,
            viewUrl: await this.minioService.getPresignedViewUrl(img.key),
          })),
        ),
      })),
    );

    return { ...solicitud, documentos: documentosConUrls };
  }

  // Revisar UN documento puntual (rápido, uno a la vez, según avanza el funcionario)
  async revisarDocumento(solicitudDocumentoId: string, dto: RevisarDocumentoDto, revisorId: string) {
    return this.prisma.solicitudDocumento.update({
      where: { id: solicitudDocumentoId },
      data: {
        estado: dto.estado,
        observacion: dto.observacion,
        revisadoPorId: revisorId,
        revisadoEn: new Date(),
      },
    });
  }

  // Confirmar: solo si TODOS los documentos obligatorios están APROBADOS
  async confirmar(solicitudId: string, dto: ConfirmarSolicitudDto, revisorId: string) {
    const solicitud = await this.prisma.solicitudIngreso.findUnique({
      where: { id: solicitudId },
      include: {
        usuario: true,
        especialidad: { include: { universidad: true } },
        tipoIngreso: true,
        documentos: { include: { tipoDocumento: true } },
      },
    });

    if (!solicitud) {
      throw new NotFoundException('La solicitud no existe.');
    }

    const documentosObligatoriosPendientes = solicitud.documentos.filter(
      (d) => d.tipoDocumento.obligatorio && d.estado !== 'APROBADO',
    );

    const expedienteCompleto = documentosObligatoriosPendientes.length === 0;

    if (!expedienteCompleto) {
      const permiteExcepcion = solicitud.especialidad.universidad.permiteExcepcionExpedienteIncompleto;

      if (!permiteExcepcion) {
        throw new BadRequestException(
          `Esta universidad no permite confirmar con documentos pendientes. Faltan: ${documentosObligatoriosPendientes.map((d) => d.tipoDocumento.nombre).join(', ')}`,
        );
      }

      if (!dto.confirmarConExcepcion || !dto.motivoExcepcion) {
        throw new BadRequestException({
          message: 'Hay documentos obligatorios sin aprobar. Para confirmar de todas formas, envía confirmarConExcepcion: true y un motivoExcepcion.',
          documentosPendientes: documentosObligatoriosPendientes.map((d) => d.tipoDocumento.nombre),
        });
      }
    }

    if (!solicitud.usuario.personaId) {
      throw new BadRequestException('El aspirante no tiene datos personales registrados.');
    }

    return this.prisma.$transaction(async (tx) => {
      const nuevoEstudiante = await tx.estudiante.create({
        data: {
          personaId: solicitud.usuario.personaId!,
          universidadId: solicitud.especialidad.universidadId,
          tipoIngresoId: solicitud.tipoIngresoId,
          expedienteCompleto,
          ...(!expedienteCompleto && {
            excepcionAutorizadaPorId: revisorId,
            excepcionMotivo: dto.motivoExcepcion,
            excepcionFecha: new Date(),
          }),
        },
      });

      const rolEstudiante = await tx.rol.findUnique({ where: { nombre: 'ESTUDIANTE' } });

      await tx.usuarioRol.create({
        data: {
          usuarioId: solicitud.usuarioId,
          rolId: rolEstudiante!.id,
          universidadId: solicitud.especialidad.universidadId,
        },
      });

      return tx.solicitudIngreso.update({
        where: { id: solicitudId },
        data: {
          estado: 'CONFIRMADA',
          estudianteId: nuevoEstudiante.id,
        },
        include: { estudiante: true },
      });
    });
  }

  async rechazar(solicitudId: string, motivo: string) {
    return this.prisma.solicitudIngreso.update({
      where: { id: solicitudId },
      data: {
        estado: 'RECHAZADA',
        observacionGeneral: motivo,
      },
    });
  }
}
