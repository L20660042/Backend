import { Controller, Post, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AIService } from './ai.service';

@Controller('emotion')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('user') user: string
  ) {
    return this.aiService.analyzeDrawing(file.buffer, user);
  }

  @Post('analyze-text')
  async analyzeText(
    @Body('text') text: string,
    @Body('user') user: string
  ) {
    return this.aiService.analyzeHandwriting(text, user);
  }
}