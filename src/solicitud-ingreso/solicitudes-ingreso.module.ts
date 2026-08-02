import { Module } from '@nestjs/common';
import { SolicitudesIngresoService } from './solicitudes-ingreso.service';
import { SolicitudesIngresoController } from './solicitudes-ingreso.controller';
import { MinioModule } from 'src/minio/minio.module';

@Module({
  imports: [MinioModule],
  providers: [SolicitudesIngresoService],
  controllers: [SolicitudesIngresoController]
})
export class SolicitudesIngresoModule {}
