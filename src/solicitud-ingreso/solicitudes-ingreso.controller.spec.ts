import { Test, TestingModule } from '@nestjs/testing';
import { SolicitudesIngresoController } from './solicitudes-ingreso.controller';

describe('SolicitudIngresoController', () => {
  let controller: SolicitudesIngresoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SolicitudesIngresoController],
    }).compile();

    controller = module.get<SolicitudesIngresoController>(SolicitudesIngresoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
