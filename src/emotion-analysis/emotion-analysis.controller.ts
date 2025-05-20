import { Controller, Post, Get, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EmotionAnalysisService } from './emotion-analysis.service';

@Controller('emotion-analysis')
export class EmotionAnalysisController {
  constructor(private readonly emotionAnalysisService: EmotionAnalysisService) {}

  @Post('analyze-image')
  @UseInterceptors(FileInterceptor('image'))
  async analyzeImage(@UploadedFile() file: Express.Multer.File, @Query('userId') userId: string) {
    // Usar un ID predeterminado si no se proporciona
    const userIdToUse = userId || 'default-user-id';
    return this.emotionAnalysisService.analyzeImage(file, userIdToUse);
  }

  @Get('history')
  async getAnalysisHistory(@Query('userId') userId: string) {
    // Usar un ID predeterminado si no se proporciona
    const userIdToUse = userId || 'default-user-id';
    return this.emotionAnalysisService.getAnalysisHistory(userIdToUse);
  }
}