import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para todos los orígenes
  app.enableCors({
    origin: [
      'https://l20660042.github.io', // frontend
      'https://iaemocion-production.up.railway.app:8000', // IA backend
    ],
    methods: 'GET,POST,PUT,DELETE',
    credentials: true, // si usas cookies o auth
  });
  app.use(json({ limit: '10mb' }));
  await app.listen(3000);
}
bootstrap();
