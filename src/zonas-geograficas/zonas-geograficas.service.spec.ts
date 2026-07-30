import { Test, TestingModule } from '@nestjs/testing';
import { ZonasGeograficasService } from './zonas-geograficas.service';

describe('ZonasGeograficasService', () => {
  let service: ZonasGeograficasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZonasGeograficasService],
    }).compile();

    service = module.get<ZonasGeograficasService>(ZonasGeograficasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
