import { IsString, IsNotEmpty } from 'class-validator';

export class RechazarSolicitudDto {
  @IsString()
  @IsNotEmpty()
  motivo: string;
}