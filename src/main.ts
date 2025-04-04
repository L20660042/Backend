import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  
  app.enableCors({
    origin: '*', // o reemplaza con el dominio correcto
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = parseInt(process.env.PORT, 10) || 3000;
  await app.listen(port, () => {
    console.log(`🚀 App corriendo en el puerto ${port}`);
  });
}

bootstrap();

export default server;
