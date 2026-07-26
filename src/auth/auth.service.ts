import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegistroUsuarioDto } from './dto/registro-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService){}

    async registrar(dto: RegistroUsuarioDto){
        // 1. Encriptar la contraseña (10 rondas es el estándar de seguridad)
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(dto.password, saltOrRounds);
        // 2. Insertar en la base de datos
        // Gracias a nuestro GlobalExceptionFilter, ya no necesitamos hacer un "findUnique" 
        // previo para ver si el correo existe. Si Prisma arroja el error P2002 de duplicidad, 
        // el filtro lo atrapará y devolverá el mensaje estandarizado al frontend.
        const nuevoUsuario = await this.prismaService.usuario.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                roles: {
                    create: {
                        rol: {
                            connect: { nombre: 'ASPIRANTE' }
                        }
                    }
                }
            },
            // Incluimos los roles en la respuesta para confirmar que se asignó correctamente
            include: {
                roles: {
                    include: { rol: true }
                }
            }
        });
        // 3. Separar la contraseña del objeto final por seguridad
        const { password, ...usuarioLimpio } = nuevoUsuario;
        // Al retornar "usuarioLimpio", nuestro TransformInterceptor
        // lo envolverá automáticamente en { isSuccess: true, data: { ... } }
        return usuarioLimpio;
    }
}