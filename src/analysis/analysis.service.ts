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
    const created = new this.analysisModel(data);
    return created.save();
  }

  async findAll(): Promise<Analysis[]> {
    return this.analysisModel.find().sort({ date: -1 }).limit(10);
  }
}
