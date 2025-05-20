import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { EmotionAnalysisController } from './emotion-analysis.controller';
import { EmotionAnalysisService } from './emotion-analysis.service';
import { EmotionAnalysis, EmotionAnalysisSchema } from './schemas/emotion-analysis.schema';

@Module({
  imports: [
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
    MongooseModule.forFeature([
      { name: EmotionAnalysis.name, schema: EmotionAnalysisSchema },
    ]),
  ],
  controllers: [EmotionAnalysisController],
  providers: [EmotionAnalysisService],
})
export class EmotionAnalysisModule {}