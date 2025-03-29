// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://tomas:tomas@cluster0.ztveb.mongodb.net/NuevoProyecto'),
    UsersModule,
    AuthModule
  ],
})
export class AppModule {}
