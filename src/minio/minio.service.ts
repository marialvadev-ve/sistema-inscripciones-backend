import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import * as Client from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private minioClient: Client.Client;
  private readonly bucketName = 'expedientes-universidad';

  onModuleInit() {
    this.minioClient = new Client.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || '9000', 10),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    });

    this.ensureBucketExists();
  }

  private async ensureBucketExists() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
      }
    } catch (error) {
      throw new InternalServerErrorException('Error al inicializar el almacenamiento de archivos.');
    }
  }

  async getPresignedUploadUrl(
    universidad: string,
    especialidad: string,
    lapsoAcademico: string,
    cedulaOId: string,
    tipoDocumento: string,
  ): Promise<{ uploadUrl: string; filePath: string }> {
    try {
      const uni = universidad.trim().toUpperCase();
      const esp = especialidad.trim().toLowerCase().replace(/\s+/g, '-');
      const lapso = lapsoAcademico.trim();
      const fileName = `${cedulaOId}_${tipoDocumento}.pdf`;
      const filePath = `${uni}/${esp}/${lapso}/${fileName}`;

      const expirySeconds = 60 * 5;
      const uploadUrl = await this.minioClient.presignedPutObject(
        this.bucketName,
        filePath,
        expirySeconds,
      );

      return { uploadUrl, filePath };
    } catch (error) {
      // Lanzamos una excepción controlada que el GlobalExceptionFilter transformará para el frontend
      throw new InternalServerErrorException('No se pudo generar la URL de subida del expediente.');
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