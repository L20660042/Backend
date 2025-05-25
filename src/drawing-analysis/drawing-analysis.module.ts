import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DrawingAnalysisController } from './drawing-analysis.controller';
import { DrawingAnalysisService } from './drawing-analysis.service';
import { DrawingAnalysis, DrawingAnalysisSchema } from './schemas/drawing-analysis.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
  { name: DrawingAnalysis.name, schema: DrawingAnalysisSchema },
])

  ],
  controllers: [DrawingAnalysisController],
  providers: [DrawingAnalysisService],
  exports: [DrawingAnalysisService],
})
export class DrawingAnalysisModule {}
