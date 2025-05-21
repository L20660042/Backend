import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnalysisDocument = Analysis & Document;

@Schema()
export class Analysis {
  @Prop()
  imageUrl: string;

  @Prop()
  text: string;

  @Prop({ type: Object })
  emotions: Record<string, number>;

  @Prop()
  dominantEmotion: string;

  @Prop()
  date: Date;
}

export const AnalysisSchema = SchemaFactory.createForClass(Analysis);
