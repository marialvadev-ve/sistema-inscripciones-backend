import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CrearEntradaDto } from './dto/crear-entrada.dto';

@Injectable()
export class EntradaService {
    constructor(private readonly prisma: PrismaService) {}
    
    async crearEntrada(dto: CrearEntradaDto) {
        const existente = await this.prisma.entrada.findFirst({
            where: { universidadId: dto.universidadId, codigo: dto.codigo },
        });
        if (existente) {
            throw new ConflictException(`Ya existe una entrada con el código '${dto.codigo}' en esta universidad.`);
        }
        return this.prisma.entrada.create({ data: dto });
    }

     async listarEntradasPorUniversidad(universidadId: string) {
        return this.prisma.entrada.findMany({
            where: { universidadId, activo: true },
            orderBy: { codigo: 'asc' },
        });
    }
}
