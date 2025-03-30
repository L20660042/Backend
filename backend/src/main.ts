import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS con la URL del frontend en Vercel
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  // Usar el puerto que asigna Vercel o 3000 en local
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
}

bootstrap();
