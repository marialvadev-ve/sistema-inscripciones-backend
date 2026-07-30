import { IsString, IsNotEmpty, IsUUID, IsBoolean, IsOptional } from 'class-validator';

export class CrearProgramaDto {
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsUUID()
  @IsNotEmpty()
  nivelAcademicoId: string;

  @IsUUID()
  @IsNotEmpty()
  universidadId: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}