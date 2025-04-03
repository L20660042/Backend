import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Enum para los roles disponibles
export enum Role {
  USUARIO = 'USUARIO',
  ADMIN = 'ADMIN',
}

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  correo: string;

  @Prop({ required: true })
  pase: string;

  @Prop({ required: true })
  nombre: string;

  @Prop({ enum: Role, default: Role.USUARIO })
  rol: Role;

}

export const UserSchema = SchemaFactory.createForClass(User);
