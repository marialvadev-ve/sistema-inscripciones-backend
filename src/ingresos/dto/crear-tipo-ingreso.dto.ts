import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CrearTipoIngresoDto {
  @IsUUID()
  @IsNotEmpty()
  universidadId: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}