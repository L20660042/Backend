import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import * as nodemailer from 'nodemailer';

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

  // Login method
  async login(loginDto: LoginDto): Promise<any> {
    const { correo, pase } = loginDto;

    const user = await this.userModel.findOne({ correo });

    if (!user) {
      throw new Error('Correo electrónico o contraseña incorrectos');
    }

    const isPasswordValid = await bcrypt.compare(pase, user.pase);
    if (!isPasswordValid) {
      throw new Error('Correo electrónico o contraseña incorrectos');
    }

    const payload = { userId: user._id, role: user.rol };
    const token = jwt.sign(payload, 'tu_secreto', { expiresIn: '1h' });

    return {
      message: 'Inicio de sesión exitoso',
      token,
      role: user.rol,
    };
  }

  async getUserById(userId: string): Promise<User> {
    return this.userModel.findById(userId).select('-pase');
  }

  async updateUserById(userId: string, updateData: Partial<User>): Promise<User> {
    if (updateData.pase) {
      updateData.pase = await bcrypt.hash(updateData.pase, 10);
    }
    return this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).select('-pase');
  }

  async updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    return this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).select('-pase');
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().select('-pase');
  }

  private async sendResetEmail(email: string, token: string) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // true for 465, false for other ports like 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const resetUrl = `https://l20660042.github.io/Frontend/reset-password?token=${token}`;

    const mailOptions = {
      from: `"Tu App" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Restablece tu contraseña',
      html: `
        <p>Para restablecer tu contraseña, haz click en el siguiente enlace:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Si no solicitaste esto, ignora este correo.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userModel.findOne({ correo: email });
    if (!user) {
      // Avoid leaking info
      return;
    }

    const token = uuidv4();
    const expiry = new Date(Date.now() + 3600 * 1000); // 1 hour expiry

    user.resetToken = token;
    user.resetTokenExpiry = expiry;

    await user.save();

    await this.sendResetEmail(email, token);
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
