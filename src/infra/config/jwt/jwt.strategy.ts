import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/infra/config/prisma/prisma.service';

export interface IJwtPayload {
  sub: string;
  email: string;
  role: string;
  churchId: string;
  type: string;
  iat: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: IJwtPayload) {
    if (payload.type !== 'access') throw new UnauthorizedException('Invalid token type');

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedException();

    if (user.passwordChangedAt && user.passwordChangedAt.getTime() > payload.iat * 1000) {
      throw new UnauthorizedException('Session invalidated after password change');
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      churchId: payload.churchId,
    };
  }
}
