import {
  IsString, IsNotEmpty, IsEmail, IsEnum, IsDateString,
  IsUUID, IsOptional,
} from 'class-validator';
import { Genero, EstadoCivil, TipoVivienda } from '@prisma/client';

export class CrearPersonaDto {
  @IsString()
  @IsNotEmpty()
  cedula: string;

  @IsString()
  @IsNotEmpty()
  nacionalidad: string;

  @IsString()
  @IsNotEmpty()
  nombres: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsEnum(Genero)
  genero: Genero;

  @IsEnum(EstadoCivil)
  estadoCivil: EstadoCivil;

  @IsDateString()
  fechaNacimiento: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsEmail()
  correo: string;

  @IsUUID()
  paisId: string;

  @IsUUID()
  estadoId: string;

  @IsUUID()
  municipioId: string;

  @IsUUID()
  parroquiaId: string;

  @IsOptional()
  @IsString()
  localidad?: string;

  @IsOptional()
  @IsString()
  calle?: string;

  @IsOptional()
  @IsString()
  numeroCasa?: string;

  @IsOptional()
  @IsString()
  puntoReferencia?: string;

  @IsEnum(TipoVivienda)
  tipoVivienda: TipoVivienda;
}