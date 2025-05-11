import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { EmotionAnalysisController } from './emotion-analysis.controller';
import { EmotionAnalysisService } from './emotion-analysis.service';
import { EmotionAnalysis, EmotionAnalysisSchema } from '../users/schemas/emotion-analysis.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmotionAnalysis.name, schema: EmotionAnalysisSchema },
    ]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [EmotionAnalysisController],
  providers: [EmotionAnalysisService],
  exports: [EmotionAnalysisService],
})
export class EmotionAnalysisModule {}