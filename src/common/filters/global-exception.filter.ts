import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let errors = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse: any = exception.getResponse();

      // El mensaje general ahora depende del tipo de error, no del texto en inglés que da NestJS por defecto
      message = this.obtenerMensajePorStatus(status);

      const mensajeOriginal = exceptionResponse?.message;
      if (Array.isArray(mensajeOriginal)) {
        errors = { detalle: mensajeOriginal };
      } else {
        errors = { causa: mensajeOriginal || exceptionResponse?.error || 'Error de petición' };
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        message = 'Conflicto de duplicidad';
        const target = exception.meta?.target as string[];
        const field = target ? target[0] : 'registro';
        errors = { [field]: `El ${field} ya se encuentra registrado en el sistema.` };
      }
    } else {
      console.error('Error no controlado:', exception);
      errors = { critico: 'Ocurrió un error inesperado en el sistema.' };
    }

    response.status(status).json({
      isSuccess: false,
      message,
      errors,
    });
  }

  private obtenerMensajePorStatus(status: number): string {
    const mensajes: Record<number, string> = {
      400: 'Solicitud inválida',
      401: 'No autorizado',
      403: 'Acceso denegado',
      404: 'Recurso no encontrado',
      409: 'Conflicto de duplicidad',
      410: 'Recurso ya no disponible',
      422: 'Datos no procesables',
      500: 'Error interno del servidor',
    };
    return mensajes[status] || 'Error de petición';
  }
}