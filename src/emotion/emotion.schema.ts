import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Analysis extends Document {
  @Prop() user: string;
  @Prop() emotion: string;
  @Prop() details: Record<string, number>;
  @Prop() date: Date;
}

export const AnalysisSchema = SchemaFactory.createForClass(Analysis);
