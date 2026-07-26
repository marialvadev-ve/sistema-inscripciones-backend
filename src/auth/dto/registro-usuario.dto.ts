import { IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class RegistroUsuarioDto {
  @IsEmail({}, { message: 'El formato del correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(32, { message: 'La contraseña no puede exceder los 32 caracteres' })
  password: string;
}