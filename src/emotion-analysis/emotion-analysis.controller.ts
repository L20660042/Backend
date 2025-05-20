import { Controller, Post, UploadedFile, UseInterceptors, Query, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EmotionAnalysisService } from './emotion-analysis.service';

@Controller('emotion-analysis')
export class EmotionAnalysisController {
  constructor(private readonly service: EmotionAnalysisService) {}

  @Post('analyze-image')
  @UseInterceptors(FileInterceptor('image'))
  async analyzeImage(
    @UploadedFile() file: Express.Multer.File,
    @Query('userId') userId?: string
  ) {
    if (!file) {
      throw new HttpException(
        'Debes subir una imagen para análisis',
        HttpStatus.BAD_REQUEST
      );
    }
    return this.service.analyzeImage(file, userId || 'default-user-id');
  }
}