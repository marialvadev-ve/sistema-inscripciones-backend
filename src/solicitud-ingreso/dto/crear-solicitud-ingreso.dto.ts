import { IsUUID, IsNotEmpty } from 'class-validator';

export class CrearSolicitudIngresoDto {
  @IsUUID()
  @IsNotEmpty()
  convocatoriaId: string;

  @IsUUID()
  @IsNotEmpty()
  origenId: string;

  @IsUUID()
  @IsNotEmpty()
  tipoIngresoId: string;

  @IsUUID()
  @IsNotEmpty()
  especialidadId: string;
}