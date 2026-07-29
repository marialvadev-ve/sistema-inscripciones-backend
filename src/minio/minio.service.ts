import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Client from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private minioClient: Client.Client;
  private readonly bucketName: string = 'expedientes-nuin';
  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>('MINIO_BUCKET_NAME') || 'expedientes-nuin';
  }

  onModuleInit() {
    this.minioClient = new Client.Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT') || 'localhost',
      port: parseInt(this.configService.get<string>('MINIO_PORT') || '9000', 10),
      useSSL: this.configService.get<string>('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY') || 'minioadmin',
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY') || 'minioadmin',
    });
    this.ensureBucketExists();
  }

  private async ensureBucketExists() {
  try {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName, process.env.AWS_REGION || 'us-east-1');
      console.log(`Bucket '${this.bucketName}' creado exitosamente.`);
    } else {
      console.log(`El bucket '${this.bucketName}' ya existe.`);
    }
  } catch (error) {
    // 🔍 AQUÍ ESTÁ EL TRUCO: Imprimimos el error completo en la consola
    console.error('❌ ERROR DETALLADO DE MINIO:', error);
    throw new InternalServerErrorException('Error al inicializar el almacenamiento de archivos.');
  }
}

  async getPresignedUploadUrl(filePath: string): Promise<string> {
    try {
      const expirySeconds = 60 * 5;
      return await this.minioClient.presignedPutObject(this.bucketName, filePath, expirySeconds);
    } catch (error) {
      console.error('Error generando URL de subida:', error);
      throw new InternalServerErrorException('No se pudo generar la URL de subida del documento.');
    }
  }

  async getPresignedViewUrl(filePath: string): Promise<string> {
    try {
      const expirySeconds = 60 * 10;
      return await this.minioClient.presignedGetObject(
        this.bucketName,
        filePath,
        expirySeconds,
      );
    } catch (error) {
      throw new InternalServerErrorException('No se pudo generar el enlace de visualización del documento.');
    }
  }

  // ELIMINACIÓN CONTROLADA: Si falla, informamos limpiamente
  async deleteFile(filePath: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucketName, filePath);
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar el archivo anterior en el almacenamiento.');
    }
  }

  // Método público para subir un buffer directamente a una ruta específica
  async uploadFile(filePath: string, fileBuffer: Buffer, mimeType: string = 'application/pdf'): Promise<void> {
    try {
      await this.minioClient.putObject(
        this.bucketName,
        filePath,
        fileBuffer,
        fileBuffer.length,
        { 'Content-Type': mimeType }
      );
    } catch (error) {
      throw new InternalServerErrorException('Error al subir el archivo al almacenamiento.');
    }
  }
}