import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EmotionAnalysis } from './schemas/emotion-analysis.schema';

@Injectable()
export class EmotionAnalysisService {
  private readonly logger = new Logger(EmotionAnalysisService.name);
  private readonly EMOTION_SERVICE_URL = process.env.EMOTION_SERVICE_URL || 'http://emotion-service:8000';

  constructor(
    @InjectModel(EmotionAnalysis.name) private readonly emotionAnalysisModel: Model<EmotionAnalysis>,
  ) {}

  async analyzeText(text: string, userId: string) {
    try {
      if (!text || text.trim().length === 0) {
        throw new Error('El texto no puede estar vacío');
      }

      // Llamar al microservicio de Python
      const response = await axios.post(`${this.EMOTION_SERVICE_URL}/analyze`, { 
        text: text.substring(0, 2000) 
      });
      
      // Guardar en MongoDB
      const analysis = new this.emotionAnalysisModel({
        userId,
        text: text.substring(0, 500), // Guardar solo un fragmento
        emotions: response.data.emotions,
        dominantEmotion: response.data.dominant_emotion,
        createdAt: new Date(),
      });
      
      await analysis.save();

      return {
        success: true,
        data: {
          emotions: response.data.emotions,
          dominantEmotion: response.data.dominant_emotion,
          analysisId: analysis._id,
          textSample: response.data.text_sample,
        },
      };
    } catch (error) {
      this.logger.error(`Error analyzing text: ${error.message}`);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to analyze text',
      };
    }
  }

  async getUserAnalyses(userId: string, limit = 10) {
    return this.emotionAnalysisModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}