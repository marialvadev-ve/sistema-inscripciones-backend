import { BadRequestException, ForbiddenException, GoneException, Injectable, 
    NotFoundException, 
    UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegistroUsuarioDto } from './dto/registro-usuario.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private jwtService: JwtService,
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
                        // universidadId queda en null a propósito: el rol ASPIRANTE es global
                    }
                }
            },
            include: {
                roles: { include: { rol: true } }
            }
        });

        // Generamos el token de verificación de correo
        const token = randomBytes(32).toString('hex');
        await this.prismaService.tokenAcceso.create({
            data: {
                usuarioId: nuevoUsuario.id,
                token,
                tipo: 'VERIFICACION_EMAIL',
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
            },
        });

        // TODO: aquí se engancha el envío real del correo (lo resolvemos cuando montemos el servicio de email)
        // Por ahora, lo dejamos disponible para pruebas manuales:
        console.log(`Token de verificación para ${dto.email}: ${token}`);

        const { password, ...usuarioLimpio } = nuevoUsuario;
        return usuarioLimpio;
    }

    async verificarEmail(token: string) {
        // 1. Buscamos el token exacto
        const tokenAcceso = await this.prismaService.tokenAcceso.findUnique({
            where: { token },
        });

        // 2. Validaciones, en orden de especificidad
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

        // 3. Todo válido: marcamos el correo como verificado Y el token como usado, en una sola operación atómica
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
        // Buscamos al usuario con sus roles y su vinculación institucional multi-universidad[cite: 1]
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
        // Payload optimizado y ligero para consultas concurrentes
        const payload = {
            sub: usuario.id,
            email: usuario.email,
            roles: usuario.roles.map((ur) => ur.rol.nombre),
            universidades: usuario.universidades.map((uu) => uu.universidadId),
        };
        // Access Token de corta duración (15 min) y Refresh Token seguro (7 días)
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
}