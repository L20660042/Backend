import { Injectable, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import * as nodemailer from 'nodemailer';

import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private transporter;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: Number(this.configService.get<number>('SMTP_PORT')),
      secure: false, // Usually false for port 587
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
    this.logger.log(`SMTP transporter initialized for user: ${this.configService.get<string>('SMTP_USER')}`);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { pase, ...rest } = createUserDto;

    const hashedPassword = await bcrypt.hash(pase, 10);

    const createdUser = new this.userModel({
      ...rest,
      pase: hashedPassword,
    });

    return createdUser.save();
  }

  async login(loginDto: LoginDto): Promise<{ message: string; token: string; role: string }> {
    const { correo, pase } = loginDto;

    const user = await this.userModel.findOne({ correo }).exec();
    if (!user) {
      throw new BadRequestException('Correo electrónico o contraseña incorrectos');
    }

    const isPasswordValid = await bcrypt.compare(pase, user.pase);
    if (!isPasswordValid) {
      throw new BadRequestException('Correo electrónico o contraseña incorrectos');
    }

    const payload = { userId: user._id, role: user.rol };
    const secret = this.configService.get<string>('JWT_SECRET') || 'tu_secreto';
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    return {
      message: 'Inicio de sesión exitoso',
      token,
      role: user.rol,
    };
  }

  async getUserById(userId: string): Promise<User> {
    return this.userModel.findById(userId).select('-pase').exec();
  }

  async updateUserById(userId: string, updateData: Partial<User>): Promise<User> {
    if (updateData.pase) {
      updateData.pase = await bcrypt.hash(updateData.pase, 10);
    }
    return this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).select('-pase').exec();
  }

  async updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    return this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).select('-pase').exec();
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().select('-pase').exec();
  }

  private async sendResetEmail(email: string, token: string) {
    try {
      const resetUrl = `${this.configService.get<string>('FRONTEND_URL') || 'https://l20660042.github.io/Frontend'}/reset-password?token=${token}`;

      const mailOptions = {
        from: `"Tu App" <${this.configService.get<string>('SMTP_USER')}>`,
        to: email,
        subject: 'Restablece tu contraseña',
        html: `
          <p>Para restablecer tu contraseña, haz click en el siguiente enlace:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>Si no solicitaste esto, ignora este correo.</p>
        `,
      };

      this.logger.log('Sending reset email with options:', mailOptions);
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Correo de restablecimiento enviado a ${email}`);
    } catch (error) {
      this.logger.error('Error enviando correo de restablecimiento:', error);
      throw new InternalServerErrorException('No se pudo enviar el correo de restablecimiento');
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userModel.findOne({ correo: email }).exec();
    if (!user) {
      this.logger.warn(`Solicitud de restablecimiento para correo inexistente: ${email}`);
      return; // Silently succeed to avoid user enumeration
    }

    const token = uuidv4();
    const expiry = new Date(Date.now() + 3600 * 1000); // 1 hour

    user.resetToken = token;
    user.resetTokenExpiry = expiry;

    await user.save();

    await this.sendResetEmail(email, token);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      if (!token || !newPassword) {
        throw new BadRequestException('Token y nueva contraseña son requeridos');
      }

      const user = await this.userModel.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: new Date() },
      }).exec();

      if (!user) {
        throw new BadRequestException('Token inválido o expirado');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.pase = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiry = null;

      await user.save();
    } catch (error) {
      this.logger.error('Error en resetPassword:', error);
      throw error;
    }
  }
}
