import { Module } from '@nestjs/common';
import { EmotionAnalysisService } from './emotion-analysis.service';
import { EmotionAnalysisController } from './emotion-analysis.controller';

@Module({
  providers: [EmotionAnalysisService],
  controllers: [EmotionAnalysisController]
})
export class EmotionAnalysisModule {}
