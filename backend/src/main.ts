import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configura CORS para que tu backend acepte peticiones desde el frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'https://l20660042.github.io/Frontend/',  // Usar la URL de tu frontend en producción
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  await app.listen(3000);
}
bootstrap();
