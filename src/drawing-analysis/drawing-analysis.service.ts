import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DrawingAnalysis, DrawingAnalysisDocument } from './schemas/drawing-analysis.schema';
import { CreateDrawingAnalysisDto } from './dto/create-drawing-analysis.dto';

@Injectable()
export class DrawingAnalysisService {
  constructor(
    @InjectModel(DrawingAnalysis.name) private drawingAnalysisModel: Model<DrawingAnalysisDocument>,
  ) {}

  async create(createDrawingAnalysisDto: CreateDrawingAnalysisDto): Promise<DrawingAnalysis> {
    const created = new this.drawingAnalysisModel(createDrawingAnalysisDto);
    return created.save();
  }

  async findAll(): Promise<DrawingAnalysis[]> {
    return this.drawingAnalysisModel.find().sort({ date: -1 }).exec();
  }

  async findOne(id: string): Promise<DrawingAnalysis> {
    return this.drawingAnalysisModel.findById(id).exec();
  }

  async remove(id: string): Promise<void> {
    await this.drawingAnalysisModel.findByIdAndDelete(id).exec();
  }
}
