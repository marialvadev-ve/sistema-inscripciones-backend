import { Test, TestingModule } from '@nestjs/testing';
import { ZonasGeograficasController } from './zonas-geograficas.controller';

describe('ZonasGeograficasController', () => {
  let controller: ZonasGeograficasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZonasGeograficasController],
    }).compile();

    controller = module.get<ZonasGeograficasController>(ZonasGeograficasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
