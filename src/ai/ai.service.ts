import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AIService {
  constructor(private configService: ConfigService) {}

  async analyzeDrawing(imageBuffer: Buffer, username: string) {
    const apiKey = this.configService.get('CLARIFAI_API_KEY');
    try {
      const response = await axios.post(
        'https://api.clarifai.com/v2/models/face-emotion-recognition/outputs',
        {
          inputs: [{ data: { image: { base64: imageBuffer.toString('base64') } }]
        },
        { headers: { 'Authorization': `Key ${apiKey}` } }
      );
      
      return {
        user: username,
        emotion: response.data.outputs[0].data.concepts[0].name,
        confidence: response.data.outputs[0].data.concepts[0].value,
        details: response.data
      };
    } catch (error) {
      throw new Error(`AI Service Error: ${error.message}`);
    }
  }

  async analyzeHandwriting(text: string, username: string) {
    // Implementación similar usando API de análisis de texto
    return {
      user: username,
      sentiment: 'positivo', // Ejemplo
      spellingErrors: [],
      details: { text }
    };
  }
}