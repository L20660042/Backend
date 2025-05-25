import { IsString, IsObject } from 'class-validator';

export class CreateDrawingAnalysisDto {
  @IsString()
  imageUrl: string;

  @IsObject()
  emotions: Record<string, number>;

  @IsString()
  dominantEmotion: string;
}
