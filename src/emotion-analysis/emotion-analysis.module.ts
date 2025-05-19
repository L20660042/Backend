import { Module } from '@nestjs/common';
import { EmotionAnalysisController } from './emotion-analysis.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  ],
  controllers: [EmotionAnalysisController],
})
export class EmotionAnalysisModule {}
