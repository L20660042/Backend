import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS con el dominio específico de tu frontend
  app.enableCors({
    origin: 'https://l20660042.github.io', // URL de tu frontend
    methods: 'GET, POST, PUT, DELETE', // Métodos permitidos
    allowedHeaders: 'Content-Type, Authorization', // Encabezados permitidos
  });

  await app.listen(3000);
}
bootstrap();
