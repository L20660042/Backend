import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EmotionAnalysisDocument = EmotionAnalysis & Document;

@Schema({ timestamps: true })
export class EmotionAnalysis {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ type: Object, required: true })
  emotionResults: {
    Alegría: number;
    Tristeza: number;
    Enojo: number;
    Miedo: number;
    Sorpresa: number;
    Neutral: number;
  };

  @Prop({ required: true })
  dominantEmotion: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const EmotionAnalysisSchema = SchemaFactory.createForClass(EmotionAnalysis);
