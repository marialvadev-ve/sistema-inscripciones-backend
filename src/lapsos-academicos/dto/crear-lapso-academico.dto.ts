import { IsString, IsNotEmpty, IsUUID, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { TipoLapso } from '@prisma/client';

export class CrearLapsoAcademicoDto {
  @IsUUID()
  @IsNotEmpty()
  universidadId: string;

  @IsUUID()
  @IsNotEmpty()
  entradaId: string;

  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsDateString()
  fechaInicio: string;

  @IsDateString()
  fechaFin: string;

  @IsEnum(TipoLapso)
  tipo: TipoLapso;
}