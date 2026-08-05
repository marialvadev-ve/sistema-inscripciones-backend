import { IsIn, IsOptional, IsString } from 'class-validator';

export class RevisarDocumentoDto {
  @IsIn(['APROBADO', 'RECHAZADO'])
  estado: 'APROBADO' | 'RECHAZADO';

  @IsOptional()
  @IsString()
  observacion?: string;
}