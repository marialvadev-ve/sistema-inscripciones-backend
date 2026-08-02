import { Test, TestingModule } from '@nestjs/testing';
import { ConvocatoriasService } from './convocatorias.service';

describe('ConvocatoriasService', () => {
  let service: ConvocatoriasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConvocatoriasService],
    }).compile();

    service = module.get<ConvocatoriasService>(ConvocatoriasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
