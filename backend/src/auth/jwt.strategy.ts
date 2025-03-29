import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'tu_secreto', // Usa la misma clave secreta que utilizaste para firmar los tokens
    });
  }

  async validate(payload: any) {
    console.log('Payload JWT:', payload); 
    return { userId: payload.userId, role: payload.role }; // Devuelve el usuario validado
  }
}
