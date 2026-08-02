import { IsEnum, IsOptional, IsString } from 'class-validator';

export class RevisarDocumentoDto {
  @IsEnum(['APROBADO', 'RECHAZADO'])
  estado: 'APROBADO' | 'RECHAZADO';

  @IsOptional()
  @IsString()
  observacion?: string;
}