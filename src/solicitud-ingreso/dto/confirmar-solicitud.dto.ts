import { IsOptional, IsBoolean, IsString, ValidateIf } from 'class-validator';

export class ConfirmarSolicitudDto {
  @IsOptional()
  @IsBoolean()
  confirmarConExcepcion?: boolean;

  @ValidateIf((o) => o.confirmarConExcepcion === true)
  @IsString()
  motivoExcepcion?: string;
}