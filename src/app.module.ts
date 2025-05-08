import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AIModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    
    MongooseModule.forRoot('mongodb+srv://tomas:tomas@cluster0.ztveb.mongodb.net/NuevoProyecto'),
    UsersModule,
    AuthModule,
    AIModule
  ],
})
export class AppModule {}
