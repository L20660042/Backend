import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Analysis, AnalysisDocument } from './schemas/analysis.schema';
import { CreateAnalysisDto } from './dto/create-analysis.dto';

@Injectable()
export class AnalysisService {
  constructor(
    @InjectModel(Analysis.name) private analysisModel: Model<AnalysisDocument>
  ) {}

 async create(data: CreateAnalysisDto): Promise<Analysis> {
  console.log('Datos recibidos para guardar:', data); // ← Agrega este log
  try {
    const created = new this.analysisModel({
      ...data,
      date: new Date()
    });
    const saved = await created.save();
    console.log('Documento guardado en MongoDB:', saved); // ← Agrega este log
    return saved;
  } catch (error) {
    console.error('Error al guardar en MongoDB:', error);
    throw error;
  }
}

  async findAll(): Promise<Analysis[]> {
    return this.analysisModel.find().sort({ date: -1 }).limit(10).exec();
  }

  async findOne(id: string): Promise<Analysis> {
    return this.analysisModel.findById(id).exec();
  }
  
}