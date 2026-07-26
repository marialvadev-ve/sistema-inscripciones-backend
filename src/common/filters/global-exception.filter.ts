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
      message = exceptionResponse.error || 'Error de petición';
      
      if (Array.isArray(exceptionResponse.message)) {
        errors = { detalle: exceptionResponse.message };
      } else {
        errors = { causa: exceptionResponse.message };
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
}