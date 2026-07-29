import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class SolicitarUrlSubidaDto {
  @IsString()
  @IsNotEmpty()
  solicitudIngresoId: string;

  @IsString()
  @IsNotEmpty()
  tipoDocumentoId: string;

  @IsInt()
  @Min(1)
  orden: number; // qué página/imagen es (1, 2, 3...)

  @IsString()
  @IsNotEmpty()
  extension: string; // "jpg", "png", "pdf" — para nombrar bien el archivo
}