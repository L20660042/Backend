import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  HttpCode,
  Req,
  Res,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AIService } from './ai.service';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import * as path from 'path';
import { ApiConsumes, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Análisis de Emociones')
@Controller('emotion')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('upload')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
      }
    }),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
      files: 1
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(
          new BadRequestException('Solo se permiten imágenes JPG/JPEG/PNG'),
          false
        );
      }
      cb(null, true);
    }
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Subir imagen para análisis',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary'
        },
        user: {
          type: 'string',
          example: 'nombre_usuario'
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Análisis completado' })
  @ApiResponse({ status: 400, description: 'Archivo inválido' })
  @ApiResponse({ status: 500, description: 'Error interno' })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('user') user: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ninguna imagen');
    }

    try {
      const result = await this.aiService.analyzeDrawing(file.path, user);
      return res.json({
        success: true,
        data: result,
        fileUrl: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('analyze-text')
  @HttpCode(200)
  @ApiBody({
    description: 'Texto para análisis emocional',
    schema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          example: 'Estoy muy contento con este servicio'
        },
        user: {
          type: 'string',
          example: 'nombre_usuario'
        }
      },
      required: ['text']
    }
  })
  @ApiResponse({ status: 200, description: 'Análisis completado' })
  @ApiResponse({ status: 400, description: 'Texto inválido' })
  async analyzeText(
    @Body('text') text: string,
    @Body('user') user: string
  ) {
    if (!text || text.trim().length < 10) {
      throw new BadRequestException('El texto debe tener al menos 10 caracteres');
    }

    try {
      return await this.aiService.analyzeHandwriting(text, user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}