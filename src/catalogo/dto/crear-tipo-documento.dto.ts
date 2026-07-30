import { IsString, IsNotEmpty, IsUUID, IsOptional, IsInt, IsBoolean, Min } from 'class-validator';

export class CrearTipoDocumentoDto {
  @IsUUID()
  @IsNotEmpty()
  universidadId: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  minImagenes?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxImagenes?: number;

  @IsBoolean()
  @IsOptional()
  obligatorio?: boolean;

  @IsInt()
  @IsOptional()
  orden?: number;
}