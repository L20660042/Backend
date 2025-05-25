import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { DrawingAnalysisService } from './drawing-analysis.service';
import { CreateDrawingAnalysisDto } from './dto/create-drawing-analysis.dto';

@Controller('drawing-analysis')
export class DrawingAnalysisController {
  constructor(private readonly drawingAnalysisService: DrawingAnalysisService) {}

  @Post('save2')
  async save(@Body() createDrawingAnalysisDto: CreateDrawingAnalysisDto) {
    return this.drawingAnalysisService.create(createDrawingAnalysisDto);
  }

  @Get('all')
  async findAll() {
    return this.drawingAnalysisService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.drawingAnalysisService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.drawingAnalysisService.remove(id);
    return { success: true };
  }
}
