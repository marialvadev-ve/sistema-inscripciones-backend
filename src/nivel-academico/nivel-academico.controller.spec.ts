import { Test, TestingModule } from '@nestjs/testing';
import { NivelAcademicoController } from './nivel-academico.controller';

describe('NivelAcademicoController', () => {
  let controller: NivelAcademicoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NivelAcademicoController],
    }).compile();

    controller = module.get<NivelAcademicoController>(NivelAcademicoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
