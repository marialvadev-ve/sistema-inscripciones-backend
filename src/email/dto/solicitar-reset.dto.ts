import { IsEmail } from 'class-validator';

export class SolicitarResetDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;
}