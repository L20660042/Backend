import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class EmotionAnalysis extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  text: string;

  @Prop({ type: Object, required: true })
  emotions: Record<string, number>;

  @Prop({ required: true })
  dominantEmotion: string;

  @Prop()
  imageUrl?: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const EmotionAnalysisSchema = SchemaFactory.createForClass(EmotionAnalysis);