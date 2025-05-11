import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as tf from '@tensorflow/tfjs-node';
import * as fs from 'fs';
import * as path from 'path';
import { EmotionAnalysis, EmotionAnalysisDocument } from '../users/schemas/emotion-analysis.schema';

@Injectable()
export class EmotionAnalysisService {
  private model: tf.LayersModel;

  constructor(
    @InjectModel(EmotionAnalysis.name) private emotionAnalysisModel: Model<EmotionAnalysisDocument>,
  ) {
    // Cargar el modelo preentrenado al iniciar el servicio
    this.loadModel();
  }

  async loadModel() {
    try {
      // Cargar el modelo preentrenado desde el directorio local
      // Nota: Necesitarás descargar o entrenar un modelo y guardarlo en esta ubicación
      this.model = await tf.loadLayersModel('file://./models/emotion-detection-model/model.json');
      console.log('Modelo de detección de emociones cargado correctamente');
    } catch (error) {
      console.error('Error al cargar el modelo:', error);
    }
  }

  async analyzeImage(file: Express.Multer.File, userId: string): Promise<EmotionAnalysisDocument> {
    try {
      // Guardar la imagen en un directorio de uploads
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uniqueFilename = `${Date.now()}-${file.originalname}`;
      const filePath = path.join(uploadDir, uniqueFilename);
      fs.writeFileSync(filePath, file.buffer);
      
      // Procesar la imagen para la predicción
      const imageBuffer = fs.readFileSync(filePath);
      const imageTensor = tf.node.decodeImage(imageBuffer);
      
      // Redimensionar y normalizar la imagen según los requisitos del modelo
      const resizedImage = tf.image.resizeBilinear(imageTensor as tf.Tensor3D, [224, 224]);
      const normalizedImage = resizedImage.div(255.0).expandDims(0);
      
      // Realizar predicción
      const prediction = await this.model.predict(normalizedImage) as tf.Tensor;
      const emotionData = await prediction.data();
      
      // Mapear los resultados a las emociones
      const emotions = ['Alegría', 'Tristeza', 'Enojo', 'Miedo', 'Sorpresa', 'Neutral'];
      const emotionResults = {};
      let maxValue = 0;
      let dominantEmotion = '';
      
      for (let i = 0; i < emotions.length; i++) {
        const value = Math.round(emotionData[i] * 100);
        emotionResults[emotions[i]] = value;
        
        if (value > maxValue) {
          maxValue = value;
          dominantEmotion = emotions[i];
        }
      }
      
      // Crear la URL de la imagen (en un entorno real, podría ser un servicio de almacenamiento en la nube)
      const imageUrl = `/uploads/${uniqueFilename}`;
      
      // Guardar el análisis en la base de datos
      const analysis = new this.emotionAnalysisModel({
        userId: new Types.ObjectId(userId),
        imageUrl,
        emotionResults,
        dominantEmotion,
      });
      
      return await analysis.save();
    } catch (error) {
      console.error('Error al analizar la imagen:', error);
      throw new Error('Error al procesar la imagen para el análisis de emociones');
    }
  }

  async getUserAnalyses(userId: string): Promise<EmotionAnalysisDocument[]> {
    return this.emotionAnalysisModel.find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }
}
