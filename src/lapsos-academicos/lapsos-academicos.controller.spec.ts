import { Test, TestingModule } from '@nestjs/testing';
import { LapsosAcademicosController } from './lapsos-academicos.controller';

describe('LapsosAcademicosController', () => {
  let controller: LapsosAcademicosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LapsosAcademicosController],
    }).compile();

    controller = module.get<LapsosAcademicosController>(LapsosAcademicosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
