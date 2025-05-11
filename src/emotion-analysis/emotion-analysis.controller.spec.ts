import { Test, TestingModule } from '@nestjs/testing';
import { EmotionAnalysisController } from './emotion-analysis.controller';

describe('EmotionAnalysisController', () => {
  let controller: EmotionAnalysisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmotionAnalysisController],
    }).compile();

    controller = module.get<EmotionAnalysisController>(EmotionAnalysisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
