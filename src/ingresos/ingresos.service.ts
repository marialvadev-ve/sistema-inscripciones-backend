// src/modulos/ingresos/ingresos.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CrearTipoIngresoDto } from './dto/crear-tipo-ingreso.dto';
import { CrearOrigenIngresoDto } from './dto/crear-origen-ingreso.dto';

@Injectable()
export class IngresosService {
  constructor(private readonly prisma: PrismaService) {}

  // --- TIPOS DE INGRESO ---
  async crearTipoIngreso(dto: CrearTipoIngresoDto) {
    return this.prisma.tipoIngreso.create({ data: dto });
  }

  async obtenerTiposPorUniversidad(universidadId: string) {
    return this.prisma.tipoIngreso.findMany({
      where: { universidadId },
      orderBy: { nombre: 'asc' },
    });
  }

  // --- ORÍGENES DE INGRESO ---
  async crearOrigenIngreso(dto: CrearOrigenIngresoDto) {
    return this.prisma.origenIngreso.create({ data: dto });
  }

  async obtenerOrigenesPorUniversidad(universidadId: string) {
    return this.prisma.origenIngreso.findMany({
      where: { universidadId },
      orderBy: { nombre: 'asc' },
    });
  }
}