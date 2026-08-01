import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;
  private readonly logger = new Logger(EmailService.name);
  private readonly remitente: string;
  private readonly frontendUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
    this.remitente = this.configService.get<string>('EMAIL_FROM') as string;
    this.frontendUrl = this.configService.get<string>('FRONTEND_URL') as string;
  }

  async enviarVerificacionEmail(destinatario: string, token: string) {
    const enlace = `${this.frontendUrl}/verificar-correo?token=${token}`;

    try {
      await this.resend.emails.send({
        from: this.remitente,
        to: destinatario,
        subject: 'Confirma tu correo para continuar tu proceso de ingreso',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
            <h2>¡Bienvenido/a!</h2>
            <p>Gracias por registrarte en el sistema de inscripciones. Para continuar con tu proceso de ingreso (llenar tus datos y subir tu expediente), primero confirma tu correo haciendo clic en el siguiente botón:</p>
            <p style="text-align: center; margin: 32px 0;">
              <a href="${enlace}" style="background: #1d4ed8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Confirmar mi correo
              </a>
            </p>
            <p>Este enlace es válido por 24 horas. Si no solicitaste este registro, puedes ignorar este correo.</p>
          </div>
        `,
      });
    } catch (error) {
      this.logger.error(`Error enviando correo de verificación a ${destinatario}`, error);
      // No relanzamos el error: si el correo falla, el registro ya se completó igual.
      // El usuario puede pedir que se lo reenvíen después.
    }
  }

  async enviarResetPassword(destinatario: string, token: string) {
    const enlace = `${this.frontendUrl}/restablecer-password?token=${token}`;

    try {
      await this.resend.emails.send({
        from: this.remitente,
        to: destinatario,
        subject: 'Restablece tu contraseña',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
            <h2>Restablecer contraseña</h2>
            <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente botón para continuar:</p>
            <p style="text-align: center; margin: 32px 0;">
              <a href="${enlace}" style="background: #1d4ed8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Restablecer mi contraseña
              </a>
            </p>
            <p>Este enlace es válido por 1 hora. Si no solicitaste este cambio, puedes ignorar este correo con tranquilidad — tu contraseña actual seguirá funcionando.</p>
          </div>
        `,
      });
    } catch (error) {
      this.logger.error(`Error enviando correo de reset a ${destinatario}`, error);
    }
  }
}
