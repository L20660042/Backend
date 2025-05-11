import { Test, TestingModule } from '@nestjs/testing';
import { EmotionAnalysisService } from './emotion-analysis.service';

describe('EmotionAnalysisService', () => {
  let service: EmotionAnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmotionAnalysisService],
    }).compile();

    service = module.get<EmotionAnalysisService>(EmotionAnalysisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
