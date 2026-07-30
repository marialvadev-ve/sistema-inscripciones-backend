import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno. La aplicación no puede arrancar sin esto.');
  }
  // Activamos el Interceptor de respuestas exitosas
  app.useGlobalInterceptors(new TransformInterceptor());

  // Activamos el Filtro de errores
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Activamos la validación global de DTOs (útil para el siguiente paso)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();