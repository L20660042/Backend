import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para todos los orígenes
  app.enableCors({
    origin: 'https://l20660042.github.io', // solo permitimos ese dominio 
    credentials: true, // si usas cookies o auth
  });

  await app.listen(3000);
}
bootstrap();
