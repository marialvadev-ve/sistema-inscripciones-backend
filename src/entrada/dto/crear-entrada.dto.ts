import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CrearEntradaDto {
  @IsUUID()
  @IsNotEmpty()
  universidadId: string;

  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}