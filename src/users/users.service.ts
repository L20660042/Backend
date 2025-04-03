// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

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
}
