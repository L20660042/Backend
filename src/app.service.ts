import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '¡Servidor en Railway funcionando! 🚀';
  }
}
