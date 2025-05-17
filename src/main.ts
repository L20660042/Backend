import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // <- OJO aquí

  app.enableCors({
    origin: 'https://l20660042.github.io',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  });


  await app.listen(3000);
}
bootstrap();
