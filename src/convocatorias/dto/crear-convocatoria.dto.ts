import { IsString, IsNotEmpty, IsUUID, IsDateString, IsOptional, IsBoolean } from 'class-validator';

export class CrearConvocatoriaDto {
  @IsUUID()
  @IsNotEmpty()
  universidadId: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsDateString()
  fechaInicio: string;

  @IsDateString()
  fechaFin: string;

  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}