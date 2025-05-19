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
  @Post('analyze')
  @UseInterceptors(FileInterceptor('image'))
  async analyzeImage(
    @UploadedFile() image: Express.Multer.File,
    @Body('userId') userId: string,
  ) {
    if (!image) {
      throw new HttpException('Imagen no proporcionada', HttpStatus.BAD_REQUEST);
    }
    if (!userId) {
      throw new HttpException('userId no proporcionado', HttpStatus.BAD_REQUEST);
    }

    try {
      const formData = new FormData();
      formData.append('image', image.buffer, {
        filename: image.originalname,
        contentType: image.mimetype,
      });
      formData.append('userId', userId);

      // ⚠️ Reemplaza con la URL real de tu microservicio en Railway
      const microserviceUrl = 'https://microservice-emotions.up.railway.app/analyze';

      const response = await axios.post(microserviceUrl, formData, {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 30000, // 30 segundos de timeout
      });

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
        };
      } else {
        throw new HttpException(
          response.data.message || 'Error en microservicio IA',
          HttpStatus.BAD_GATEWAY,
        );
      }
    } catch (error) {
      console.error('Error llamando al microservicio IA:', error.message || error);
      throw new HttpException('Error al analizar la imagen', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
