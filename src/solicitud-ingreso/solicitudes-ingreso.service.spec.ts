import { Test, TestingModule } from '@nestjs/testing';
import { SolicitudesIngresoService } from './solicitudes-ingreso.service';

describe('SolicitudesIngresoService', () => {
  let service: SolicitudesIngresoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SolicitudesIngresoService],
    }).compile();

    service = module.get<SolicitudesIngresoService>(SolicitudesIngresoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
