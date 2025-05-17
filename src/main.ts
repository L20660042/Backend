import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  try {
    console.log('Iniciando app...');
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors({
      origin: 'https://l20660042.github.io',
      methods: 'GET,POST,PUT,DELETE',
      credentials: true,
    });
    await app.listen(3000);
  } catch (err) {
    console.error('Error al iniciar la app:', err);
  }
}
bootstrap();