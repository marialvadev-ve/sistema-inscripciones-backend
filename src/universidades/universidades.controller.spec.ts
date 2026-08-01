import { Test, TestingModule } from '@nestjs/testing';
import { UniversidadesController } from './universidades.controller';

describe('UniversidadesController', () => {
  let controller: UniversidadesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UniversidadesController],
    }).compile();

    controller = module.get<UniversidadesController>(UniversidadesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
