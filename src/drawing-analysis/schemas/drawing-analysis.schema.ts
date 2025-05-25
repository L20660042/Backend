import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DrawingAnalysisDocument = DrawingAnalysis & Document;

@Schema()
export class DrawingAnalysis {
  @Prop({ required: true })
  imageUrl: string;

  @Prop({ type: Object, required: true })
  emotions: Record<string, number>;

  @Prop({ required: true })
  dominantEmotion: string;

  @Prop({ default: Date.now })
  date: Date;
}

export const DrawingAnalysisSchema = SchemaFactory.createForClass(DrawingAnalysis);
