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
import { CatalogoModule } from './catalogo/catalogo.module';
import { ZonasGeograficasModule } from './zonas-geograficas/zonas-geograficas.module';
import { NivelAcademicoModule } from './nivel-academico/nivel-academico.module';
import { IngresosModule } from './ingresos/ingresos.module';

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
    ExpedientesModule, CatalogoModule, ZonasGeograficasModule, NivelAcademicoModule, IngresosModule
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
