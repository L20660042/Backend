import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Body,
    Get,
    Query,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { EmotionService } from './emotion.service';
  import { diskStorage } from 'multer';
  import { v4 as uuid } from 'uuid';
  import * as path from 'path';
  
  @Controller('emotion')
  export class EmotionController {
    constructor(private readonly emotionService: EmotionService) {}
  
    @Post('upload')
    @UseInterceptors(FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          const ext = path.extname(file.originalname);
          cb(null, `${uuid()}${ext}`);
        },
      }),
    }))
    async uploadImage(@UploadedFile() file: Express.Multer.File, @Body('user') user: string) {
      const result = await this.emotionService.analyzeImage(file.path, user);
      return result;
    }
  
    @Get('history')
    async getHistory(@Query('user') user: string) {
      return this.emotionService.getHistory(user);
    }
  }
  