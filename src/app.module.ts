import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MinioModule } from './minio/minio.module';
import { ExpedientesModule } from './expedientes/expedientes.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // CONFIGURACIÓN TOLERANTE A LATENCIA:
    // Permitimos hasta 20 peticiones (en lugar de 10) 
    // en una ventana de 60 segundos por IP.
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20, // Margen holgado para reintentos por intermitencia
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true, // <--- Esto hace que el ConfigService esté disponible en toda la app sin reimportarlo en cada módulo
    }),
    AuthModule, 
    PrismaModule, 
    MinioModule, 
    ExpedientesModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // Aplica el límite automáticamente a toda la aplicación
    },
    AppService,
  ],
})
export class AppModule {}
