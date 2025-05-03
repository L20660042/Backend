import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Analysis } from './emotion.schema';
import axios from 'axios';
import * as fs from 'fs';
import * as FormData from 'form-data';

@Injectable()
export class EmotionService {
  constructor(
    @InjectModel(Analysis.name) private analysisModel: Model<Analysis>,
  ) {}

  async analyzeImage(filePath: string, userId: string): Promise<Analysis> {
    try {
      // Preparamos la imagen como FormData
      const form = new FormData();
      form.append('image', fs.createReadStream(filePath));

      // Llamamos al microservicio de Python
      const response = await axios.post('http://localhost:5000/analyze', form, {
        headers: form.getHeaders(),
      });

      const { emotion, details } = response.data;

      // Guardamos en la base de datos
      const newAnalysis = new this.analysisModel({
        user: userId,
        emotion,
        details,
        date: new Date(),
      });

      return await newAnalysis.save();
    } catch (error) {
      throw new Error('Error al analizar la imagen o conectarse con la IA');
    }
  }

  async getHistory(userId: string): Promise<Analysis[]> {
    return this.analysisModel.find({ user: userId }).sort({ date: -1 });
  }
}
