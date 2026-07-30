import { Test, TestingModule } from '@nestjs/testing';
import { NivelAcademicoService } from './nivel-academico.service';

describe('NivelAcademicoService', () => {
  let service: NivelAcademicoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NivelAcademicoService],
    }).compile();

    service = module.get<NivelAcademicoService>(NivelAcademicoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
