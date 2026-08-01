import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CrearUniversidadDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  siglas: string;

  @IsOptional()
  @IsString()
  ubicacion?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsEmail()
  correo?: string;
}