import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import { ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de límites y seguridad
  app.use(json({ limit: '10mb' }));
  
  // CORS para producción y desarrollo
  app.enableCors({
    origin: [
      'https://l20660042.github.io',      // Producción
      'http://localhost:3000'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Authorization', 'Content-Disposition'],
    maxAge: 86400
  });

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  // Documentación Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Análisis de Emociones')
    .setDescription('Endpoints para análisis de imágenes y texto')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Manejo global de errores
  app.useGlobalFilters({
    catch(exception: unknown, host) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const status = exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        message: exception instanceof Error ? exception.message : 'Error interno'
      });
    }
  });

  await app.listen(process.env.PORT || 3000);
  console.log(`🚀 Servidor corriendo en ${await app.getUrl()}`);
}
bootstrap();