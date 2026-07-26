import { IsString, IsNotEmpty } from 'class-validator';

export class CreateExpedienteDto {
  @IsString()
  @IsNotEmpty()
  solicitudIngresoId: string;
}