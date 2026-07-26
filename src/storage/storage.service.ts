import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('MINIO_BUCKET_NAME')!;

    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
      // Agregamos el operador ! al final para garantizar que es un string
      endpoint: this.configService.get<string>('MINIO_ENDPOINT')!, 
      credentials: {
        accessKeyId: this.configService.get<string>('MINIO_ACCESS_KEY')!,
        secretAccessKey: this.configService.get<string>('MINIO_SECRET_KEY')!,
      },
      forcePathStyle: true,
    });
  }

  async uploadExpediente(file: Express.Multer.File, fullPathKey: string): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fullPathKey, // Ej: UPTAEB/PNF-INFO/2026-I/V-18137464.pdf
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);
      
      return fullPathKey;
    } catch (error) {
      console.error('Error subiendo archivo a MinIO:', error);
      throw new InternalServerErrorException('Error al subir el expediente al servidor de archivos');
    }
  }
}