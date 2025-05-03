import { Module } from '@nestjs/common';
import { EmotionService } from './emotion.service';
import { EmotionController } from './emotion.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Analysis, AnalysisSchema } from './emotion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Analysis.name, schema: AnalysisSchema }]),
  ],
  controllers: [EmotionController],
  providers: [EmotionService],
})
export class EmotionModule {}
