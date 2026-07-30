import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CrearEstadoDto, CrearMunicipioDto, CrearPaisDto, CrearParroquiaDto } from './dto/geografia.dto';

@Injectable()
export class ZonasGeograficasService {
  constructor(private readonly prisma: PrismaService) {}

  async crearPais(dto: CrearPaisDto) {
    return this.prisma.pais.create({ data: dto });
  }

  async obtenerPaises() {
    return this.prisma.pais.findMany({ orderBy: { nombre: 'asc' } });
  }

  async crearEstado(dto: CrearEstadoDto) {
    return this.prisma.estado.create({ data: dto });
  }

  async obtenerEstadosPorPais(paisId: string) {
    return this.prisma.estado.findMany({ where: { paisId }, orderBy: { nombre: 'asc' } });
  }

  async crearMunicipio(dto: CrearMunicipioDto) {
    return this.prisma.municipio.create({ data: dto });
  }

  async obtenerMunicipiosPorEstado(estadoId: string) {
    return this.prisma.municipio.findMany({ where: { estadoId }, orderBy: { nombre: 'asc' } });
  }

  async crearParroquia(dto: CrearParroquiaDto) {
    return this.prisma.parroquia.create({ data: dto });
  }

  async obtenerParroquiasPorMunicipio(municipioId: string) {
    return this.prisma.parroquia.findMany({ where: { municipioId }, orderBy: { nombre: 'asc' } });
  }
}
