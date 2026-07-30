import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CrearPaisDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}

export class CrearEstadoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsUUID()
  @IsNotEmpty()
  paisId: string;
}

export class CrearMunicipioDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsUUID()
  @IsNotEmpty()
  estadoId: string;
}

export class CrearParroquiaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsUUID()
  @IsNotEmpty()
  municipioId: string;
}