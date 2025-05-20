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

  async analyzeImage(image: Express.Multer.File, userId: string) {
    try {
      const formData = new FormData();
      formData.append('file', new Blob([image.buffer]), image.originalname);

      const response = await axios.post(`${this.EMOTION_SERVICE_URL}/analyze-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Guardar en MongoDB
      const analysis = new this.emotionAnalysisModel({
        userId,
        text: response.data.text,
        emotions: response.data.emotions,
        dominantEmotion: response.data.dominant_emotion,
        imageUrl: `/uploads/${image.filename}`, // Asume que guardas la imagen
        createdAt: new Date(),
      });

      await analysis.save();

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      this.logger.error(`Error analyzing image: ${error.message}`);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to analyze image'
      };
    }
  }

  async getUserAnalyses(userId: string) {
    return this.emotionAnalysisModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }
}