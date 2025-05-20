// Reemplaza todo el contenido con esto:
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { EmotionAnalysis } from './schemas/emotion-analysis.schema';
import * as FormData from 'form-data';

@Injectable()
export class EmotionAnalysisService {
  constructor(
    @InjectModel(EmotionAnalysis.name) private emotionAnalysisModel: Model<EmotionAnalysis>,
    private httpService: HttpService,
  ) {}

  async analyzeImage(file: Express.Multer.File, userId: string) {
    try {
      console.log('Iniciando análisis de imagen...');
      
      const formData = new FormData();
      formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype
      });

      console.log('Enviando a microservicio...');
      const response = await firstValueFrom(
        this.httpService.post(
          `${process.env.EMOTION_API_URL}/analyze-image`,
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              'Accept': 'application/json',
            },
            timeout: 30000
          }
        )
      );

      console.log('Respuesta recibida:', response.data);

      if (!response.data?.success) {
        throw new HttpException(
          response.data?.error || 'Error en el análisis de imagen',
          HttpStatus.BAD_REQUEST
        );
      }

      const analysisData = response.data.data;
      console.log('Datos de análisis:', analysisData);

      const newAnalysis = new this.emotionAnalysisModel({
        userId,
        text: analysisData.text,
        emotions: analysisData.emotions,
        dominantEmotion: analysisData.dominant_emotion,
      });

      const savedAnalysis = await newAnalysis.save();
      console.log('Análisis guardado en DB');

      return {
        success: true,
        data: {
          ...analysisData,
          analysisId: savedAnalysis._id,
        }
      };
    } catch (error) {
      console.error('Error en analyzeImage:', error);
      throw new HttpException(
        error.response?.data?.error || 
        error.message || 
        'Error al procesar la solicitud',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAnalysisHistory(userId: string) {
    return this.emotionAnalysisModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .exec();
  }
}