import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UniversidadAdminGuard } from 'src/guards/universidad-admin.guard';
import { CrearEntradaDto } from './dto/crear-entrada.dto';
import { EntradaService } from './entrada.service';

@Controller('entrada')
export class EntradaController {
    constructor( private readonly entradaService: EntradaService){}
    
    @Post('entradas')
    @UseGuards(UniversidadAdminGuard)
    crearEntrada(@Body() dto: CrearEntradaDto) {
        return this.entradaService.crearEntrada(dto);
    }

    @Get('entradas/universidad/:universidadId')
    listarEntradas(@Param('universidadId') universidadId: string) {
        return this.entradaService.listarEntradasPorUniversidad(universidadId);
    }
}
