import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface IJwtPayload {
  sub: string;
  email: string;
  role: string;
  churchId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET as string,
    });
  }

  validate(payload: IJwtPayload) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      churchId: payload.churchId,
    };
  }
}
