import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CrearNivelAcademicoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsBoolean()
  @IsOptional()
  requiereExclusividad?: boolean;
}