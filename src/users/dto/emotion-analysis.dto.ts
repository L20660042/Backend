import { IsNotEmpty } from 'class-validator';

export class AnalyzeEmotionDto {
  @IsNotEmpty()
  userId: string;

  // La imagen se enviará como un archivo en la solicitud HTTP
}