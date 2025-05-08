import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private clarifaiEndpoint = 'https://api.clarifai.com/v2/models/face-emotion-recognition/outputs';

  constructor(private configService: ConfigService) {}

  async analyzeDrawing(imagePath: string, username: string) {
    try {
      const apiKey = this.configService.get('CLARIFAI_API_KEY');
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');

      const response = await axios.post(
        this.clarifaiEndpoint,
        {
          inputs: [
            {
              data: {
                image: { base64: base64Image }
              }
            }
          ]
        },
        {
          headers: {
            'Authorization': `Key ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      if (!response.data.outputs || response.data.outputs.length === 0) {
        throw new Error('No se detectaron emociones en la imagen');
      }

      const concepts = response.data.outputs[0].data.concepts;
      const primaryEmotion = concepts[0];

      return {
        user: username,
        emotion: primaryEmotion.name,
        confidence: primaryEmotion.value,
        allEmotions: concepts.slice(0, 5),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error(`Error en analyzeDrawing: ${error.message}`);
      throw error;
    }
  }

  async analyzeHandwriting(text: string, username: string) {
    try {
      // Implementación básica - puedes conectar otra API de análisis de texto
      const sentiment = this.analyzeTextSentiment(text);
      
      return {
        user: username,
        textLength: text.length,
        sentiment,
        keywords: this.extractKeywords(text),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error(`Error en analyzeHandwriting: ${error.message}`);
      throw error;
    }
  }

  private analyzeTextSentiment(text: string): string {
    const positiveWords = ['feliz', 'contento', 'alegre', 'genial'];
    const negativeWords = ['triste', 'enojado', 'molesto', 'mal'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

    if (positiveCount > negativeCount) return 'positivo';
    if (negativeCount > positiveCount) return 'negativo';
    return 'neutral';
  }

  private extractKeywords(text: string): string[] {
    // Implementación básica - idealmente usar NLP
    const words = text.toLowerCase().split(/\s+/);
    const commonWords = new Set(['y', 'el', 'la', 'de', 'que']);
    return [...new Set(words.filter(word => 
      word.length > 3 && !commonWords.has(word)
    )].slice(0, 5);
  }
}