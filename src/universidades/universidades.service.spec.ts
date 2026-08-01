import { Test, TestingModule } from '@nestjs/testing';
import { UniversidadesService } from './universidades.service';

describe('UniversidadesService', () => {
  let service: UniversidadesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UniversidadesService],
    }).compile();

    service = module.get<UniversidadesService>(UniversidadesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
