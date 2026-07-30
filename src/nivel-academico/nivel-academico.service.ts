import { Injectable } from '@nestjs/common';
import { CrearNivelAcademicoDto } from './dto/crear-nivel-academico.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NivelAcademicoService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(dto: CrearNivelAcademicoDto) {
    return this.prisma.nivelAcademico.create({ data: dto });
  }

  async obtenerTodos() {
    return this.prisma.nivelAcademico.findMany({ orderBy: { nombre: 'asc' } });
  }
}