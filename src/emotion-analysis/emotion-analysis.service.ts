import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { EmotionAnalysis } from './schemas/emotion-analysis.schema';

@Injectable()
export class EmotionAnalysisService {
  constructor(
    @InjectModel(EmotionAnalysis.name) private emotionAnalysisModel: Model<EmotionAnalysis>,
    private httpService: HttpService,
  ) {}

  async analyzeImage(file: Express.Multer.File, userId: string) {
    try {
      // Preparar FormData para enviar al microservicio
      const formData = new FormData();
      formData.append('file', new Blob([file.buffer]), file.originalname);

      // Enviar solicitud al microservicio de Python
      const response = await firstValueFrom(
        this.httpService.post(
          `${process.env.EMOTION_API_URL}/analyze-image`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        ),
      );

      if (!response.data.success) {
        throw new HttpException(
          response.data.error || 'Error al analizar la imagen',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Crear un resumen del análisis
      const analysisData = response.data.data;
      const summary = {
        userId,
        text: analysisData.text,
        emotions: analysisData.emotions,
        dominantEmotion: analysisData.dominant_emotion,
        // Guardar la URL de la imagen si tienes un servicio de almacenamiento
        // imageUrl: url,
      };

      // Guardar en MongoDB
      const newAnalysis = new this.emotionAnalysisModel(summary);
      const savedAnalysis = await newAnalysis.save();

      return {
        ...response.data,
        analysisId: savedAnalysis._id,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al procesar la solicitud',
        HttpStatus.INTERNAL_SERVER_ERROR,
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