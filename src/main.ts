import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para todos los orígenes
  app.enableCors({
    origin: 'https://l20660042.github.io', // El dominio de tu frontend
    methods: 'GET,POST,PUT,DELETE',
    credentials: true, // si usas cookies o auth
  });
  
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
