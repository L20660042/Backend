// emotion-analysis.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import axios from 'axios';
import * as FormData from 'form-data';

@Controller('emotion-analysis')
export class EmotionAnalysisController {
  private readonly textAnalysisUrl = 'http://localhost:8000/analyze-text';

  @Post('analyze')
  @UseInterceptors(FileInterceptor('image'))
  async analyzeImage(
    @UploadedFile() image: Express.Multer.File,
    @Body('userId') userId: string,
    @Body('text') text?: string,
  ) {
    if (!image && !text) {
      throw new HttpException('Debe proporcionar imagen o texto', HttpStatus.BAD_REQUEST);
    }
    if (!userId) {
      throw new HttpException('userId no proporcionado', HttpStatus.BAD_REQUEST);
    }

    try {
      if (image) {
        // Análisis de imagen (código existente)
        const formData = new FormData();
        formData.append('image', image.buffer, {
          filename: image.originalname,
          contentType: image.mimetype,
        });
        formData.append('userId', userId);

        const microserviceUrl = 'https://microservice-ia-production.up.railway.app/analyze';

        const response = await axios.post(microserviceUrl, formData, {
          headers: formData.getHeaders(),
          timeout: 30000,
        });

        if (response.data.success) {
          return {
            success: true,
            data: response.data.data,
          };
        } else {
          throw new HttpException(response.data.message, HttpStatus.BAD_GATEWAY);
        }
      } else {
        // Análisis de texto
        const textResponse = await axios.post(this.textAnalysisUrl, {
          text,
          userId
        });

        return {
          success: true,
          data: {
            emotionResults: textResponse.data.emotions.reduce((acc, emotion) => {
              acc[emotion.label] = emotion.score * 100;
              return acc;
            }, {}),
            dominantEmotion: textResponse.data.dominant_emotion
          }
        };
      }
    } catch (error) {
      throw new HttpException(
        'Error al analizar: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}