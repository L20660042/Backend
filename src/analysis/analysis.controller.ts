import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { CreateAnalysisDto } from './dto/create-analysis.dto';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post('save')
  create(@Body() createDto: CreateAnalysisDto) {
    return this.analysisService.create(createDto);
  }

  @Get('all')
  getAll() {
    return this.analysisService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.analysisService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.analysisService.delete(id);
  }
}