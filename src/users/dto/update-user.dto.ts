import { IsOptional, IsString, IsEmail, Matches } from 'class-validator';
import { Role } from '../schemas/user.schema';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  nombre?: string; // Nombre completo del usuario

  @IsOptional()
  @IsEmail()
  correo?: string; // Correo electrónico

  @IsOptional()
  @IsString()
  rol?: Role; // Rol del usuario

  @IsOptional()
  @IsString()
  pase?: string; // Contraseña del usuario
 
}
