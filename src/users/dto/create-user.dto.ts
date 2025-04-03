import { IsEmail, IsNotEmpty, IsEnum, MinLength, IsString } from 'class-validator';
import { Role } from '../schemas/user.schema';

export class CreateUserDto {
  @IsEmail()
  correo: string;

  @IsNotEmpty()
  @MinLength(6)
  pase: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEnum(Role)
  rol: Role;
}
