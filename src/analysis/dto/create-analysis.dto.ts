export class CreateAnalysisDto {
  readonly imageUrl: string;
  readonly text: string;
  readonly emotions: Record<string, number>;
  readonly dominantEmotion: string;
  readonly date: Date;
}
