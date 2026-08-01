import { IsUUID, IsNotEmpty } from 'class-validator';

export class DesignarAdminDto {
  @IsUUID()
  @IsNotEmpty()
  usuarioId: string;
}