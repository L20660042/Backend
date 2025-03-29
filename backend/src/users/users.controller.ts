import { Body, Controller, Post, Get, Param, Patch, UseGuards, Req, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Ruta para registrar un nuevo usuario
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  // Ruta para hacer login de usuario
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const loginResponse = await this.usersService.login(loginDto);
      return loginResponse; // Retornamos el token y el rol
    } catch (error) {
      return { message: error.message || 'Error al iniciar sesión' };
    }
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    const userId = req.user.userId; // Obtenido del payload del token
    return this.usersService.getUserById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.userId;
    return this.usersService.updateUser(userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
  return this.usersService.getAllUsers();
}

@UseGuards(JwtAuthGuard)
@Patch(':id')
async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  return this.usersService.updateUserById(id, updateUserDto);
}


}
