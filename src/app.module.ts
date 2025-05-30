import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AnalysisModule } from './analysis/analysis.module';
import { DrawingAnalysisModule } from './drawing-analysis/drawing-analysis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true,envFilePath: '.env' }),
    
    MongooseModule.forRoot('mongodb+srv://tomas:tomas@cluster0.ztveb.mongodb.net/NuevoProyecto'),
    UsersModule,
    AuthModule,
    DrawingAnalysisModule,
    AnalysisModule
  ],
})
export class AppModule {}
