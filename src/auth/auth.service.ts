import { BadRequestException, ForbiddenException, GoneException, Injectable,
    NotFoundException,
    UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegistroUsuarioDto } from './dto/registro-usuario.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from 'src/email/email.service';
import { SolicitarResetDto } from 'src/email/dto/solicitar-reset.dto';
import { ResetearPasswordDto } from 'src/email/dto/resetear-password.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private jwtService: JwtService,
        private readonly emailService: EmailService,
    ){}

    async registrar(dto: RegistroUsuarioDto){
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(dto.password, saltOrRounds);

        const nuevoUsuario = await this.prismaService.usuario.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                roles: {
                    create: {
                        rol: { connect: { nombre: 'ASPIRANTE' } }
                    }
                }
            },
            include: {
                roles: { include: { rol: true } }
            }
        });

        const token = randomBytes(32).toString('hex');
        await this.prismaService.tokenAcceso.create({
            data: {
                usuarioId: nuevoUsuario.id,
                token,
                tipo: 'VERIFICACION_EMAIL',
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        });

        await this.emailService.enviarVerificacionEmail(dto.email, token);

        const { password, ...usuarioLimpio } = nuevoUsuario;
        return usuarioLimpio;
    }

    async verificarEmail(token: string) {
        const tokenAcceso = await this.prismaService.tokenAcceso.findUnique({
            where: { token },
        });

        if (!tokenAcceso) {
            throw new NotFoundException('El enlace de verificación no es válido.');
        }
        if (tokenAcceso.tipo !== 'VERIFICACION_EMAIL') {
            throw new BadRequestException('Este enlace no corresponde a una verificación de correo.');
        }
        if (tokenAcceso.usedAt) {
            throw new GoneException('Este enlace ya fue utilizado anteriormente.');
        }
        if (tokenAcceso.expiresAt < new Date()) {
            throw new GoneException('El enlace de verificación ha expirado. Solicita uno nuevo.');
        }

        await this.prismaService.$transaction([
            this.prismaService.usuario.update({
                where: { id: tokenAcceso.usuarioId },
                data: { emailVerificado: true },
            }),
            this.prismaService.tokenAcceso.update({
                where: { id: tokenAcceso.id },
                data: { usedAt: new Date() },
            }),
        ]);

        return { message: 'Correo verificado exitosamente. Ya puedes continuar con tu proceso de ingreso.' };
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        const usuario = await this.prismaService.usuario.findUnique({
            where: { email },
            include: {
                roles: { include: { rol: true } },
                universidades: { include: { universidad: true } },
                persona: true,
            },
        });
        if (!usuario) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        if (!usuario.activo) {
            throw new ForbiddenException('El usuario se encuentra inactivo');
        }
        const passwordValid = await bcrypt.compare(password, usuario.password);
        if (!passwordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const payload = {
            sub: usuario.id,
            email: usuario.email,
            roles: usuario.roles.map((ur) => ({
                nombre: ur.rol.nombre,
                universidadId: ur.universidadId,
            })),
        };

        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign({ sub: usuario.id }, { expiresIn: '7d' });
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            usuario: {
                id: usuario.id,
                email: usuario.email,
                persona: usuario.persona,
                roles: payload.roles,
                universidades: usuario.universidades.map((uu) => ({
                    id: uu.universidad.id,
                    nombre: uu.universidad.nombre,
                    siglas: uu.universidad.siglas,
                })),
            },
        };
    }

    async solicitarReset(dto: SolicitarResetDto) {
        const usuario = await this.prismaService.usuario.findUnique({
            where: { email: dto.email },
        });

        // Por seguridad, SIEMPRE respondemos lo mismo exista o no el correo —
        // así nadie puede usar este endpoint para "adivinar" qué correos están registrados.
        if (usuario) {
            const token = randomBytes(32).toString('hex');
            await this.prismaService.tokenAcceso.create({
                data: {
                    usuarioId: usuario.id,
                    token,
                    tipo: 'RESET_PASSWORD',
                    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
                },
            });
            await this.emailService.enviarResetPassword(dto.email, token);
        }

        return { message: 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.' };
    }

    async resetearPassword(dto: ResetearPasswordDto) {
        const tokenAcceso = await this.prismaService.tokenAcceso.findUnique({
            where: { token: dto.token },
        });

        if (!tokenAcceso) {
            throw new NotFoundException('El enlace no es válido.');
        }
        if (tokenAcceso.tipo !== 'RESET_PASSWORD') {
            throw new BadRequestException('Este enlace no corresponde a un restablecimiento de contraseña.');
        }
        if (tokenAcceso.usedAt) {
            throw new GoneException('Este enlace ya fue utilizado anteriormente.');
        }
        if (tokenAcceso.expiresAt < new Date()) {
            throw new GoneException('El enlace ha expirado. Solicita uno nuevo.');
        }

        const hashedPassword = await bcrypt.hash(dto.nuevaPassword, 10);

        await this.prismaService.$transaction([
            this.prismaService.usuario.update({
                where: { id: tokenAcceso.usuarioId },
                data: { password: hashedPassword },
            }),
            this.prismaService.tokenAcceso.update({
                where: { id: tokenAcceso.id },
                data: { usedAt: new Date() },
            }),
        ]);

        return { message: 'Contraseña restablecida exitosamente. Ya puedes iniciar sesión.' };
    }
}