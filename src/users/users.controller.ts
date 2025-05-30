import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  Put, 
  Patch, 
  UseGuards, 
  Req, 
  BadRequestException,
  InternalServerErrorException 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.usersService.login(loginDto);
    } catch (error) {
      throw new BadRequestException(error.message || 'Error al iniciar sesión');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    const userId = req.user.userId;
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

  @Post('request-password-reset')
  async requestPasswordReset(@Body('email') email: string) {
    try {
      await this.usersService.requestPasswordReset(email);
      return { message: 'Si el correo existe, recibirás instrucciones para restablecer la contraseña.' };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Error solicitando restablecimiento');
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    try {
      await this.usersService.resetPassword(body.token, body.newPassword);
      return { message: 'Contraseña restablecida correctamente.' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message || 'Error restableciendo contraseña');
    }
  }
}
