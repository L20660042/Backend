import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { pase, ...rest } = createUserDto;

    
    const hashedPassword = await bcrypt.hash(pase, 10);

    const createdUser = new this.userModel({
      ...rest,
      pase: hashedPassword,
    });

    return createdUser.save();
  }

  // Nueva función de login
  async login(loginDto: LoginDto): Promise<any> {
    const { correo, pase } = loginDto;

    // Buscar al usuario por el correo
    const user = await this.userModel.findOne({ correo });

    if (!user) {
      throw new Error('Correo electrónico o contraseña incorrectos');
    }

    // Comparar la contraseña ingresada con la encriptada
    const isPasswordValid = await bcrypt.compare(pase, user.pase);
    if (!isPasswordValid) {
      throw new Error('Correo electrónico o contraseña incorrectos');
    }

    // Generar un token JWT
    const payload = { userId: user._id, role: user.rol };
    const token = jwt.sign(payload, 'tu_secreto', { expiresIn: '1h' });

    return {
      message: 'Inicio de sesión exitoso',
      token,
      role: user.rol, // Regresamos el rol para redirigir al frontend
    };
  }

  async getUserById(userId: string): Promise<User> {
    return this.userModel.findById(userId).select('-pase'); // Excluye la contraseña
  }
  async updateUserById(userId: string, updateData: Partial<User>): Promise<User> {
    if (updateData.pase) {
      // Encriptar la nueva contraseña
      updateData.pase = await bcrypt.hash(updateData.pase, 10);
    }
    return this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).select('-pase');
  }
  
  async updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    return this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).select('-pase');
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().select('-pase'); // Excluir contraseña
  }  
  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userModel.findOne({ correo: email });
    if (!user) {
      // Avoid info leak — just return silently
      return;
    }

    const token = uuidv4();
    const expiry = new Date(Date.now() + 3600 * 1000); // 1 hour expiry

    user.resetToken = token;
    user.resetTokenExpiry = expiry;

    await user.save();

    // TODO: Send email with link including token (your frontend URL)
    console.log(`Password reset link: https://l20660042.github.io/Frontend/reset-password?token=${token}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userModel.findOne({ resetToken: token });

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('Token inválido o expirado.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.pase = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();
  }
}
