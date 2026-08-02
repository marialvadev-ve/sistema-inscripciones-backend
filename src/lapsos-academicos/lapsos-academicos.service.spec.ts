import { Test, TestingModule } from '@nestjs/testing';
import { LapsosAcademicosService } from './lapsos-academicos.service';

describe('LapsosAcademicosService', () => {
  let service: LapsosAcademicosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LapsosAcademicosService],
    }).compile();

    service = module.get<LapsosAcademicosService>(LapsosAcademicosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
