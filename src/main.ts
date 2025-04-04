import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para todos los orígenes
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
