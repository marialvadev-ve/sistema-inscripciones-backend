import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule], // Importamos ConfigModule para poder leer el .env
  providers: [StorageService],
  exports: [StorageService], // Lo exportamos para usarlo en otros módulos
})
export class StorageModule {}