import { Controller, Post, Get, Param, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EmotionAnalysisService } from './emotion-analysis.service';
import { AnalyzeEmotionDto } from '../users/dto/emotion-analysis.dto';

@Controller('emotion-analysis')
export class EmotionAnalysisController {
  constructor(private readonly emotionAnalysisService: EmotionAnalysisService) {}

  @Post('analyze')
  @UseInterceptors(FileInterceptor('image'))
  async analyzeImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() analyzeEmotionDto: AnalyzeEmotionDto,
  ) {
    const analysis = await this.emotionAnalysisService.analyzeImage(file, analyzeEmotionDto.userId);
    return {
      success: true,
      data: {
        emotionResults: analysis.emotionResults,
        dominantEmotion: analysis.dominantEmotion,
        imageUrl: analysis.imageUrl,
        createdAt: analysis.createdAt,
      },
    };
  }

  @Get('user/:userId')
  async getUserAnalyses(@Param('userId') userId: string) {
    const analyses = await this.emotionAnalysisService.getUserAnalyses(userId);
    return {
      success: true,
      data: analyses,
    };
  }
}
