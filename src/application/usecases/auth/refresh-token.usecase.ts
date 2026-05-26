import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/domain/repositories/user.repository';

export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class RefreshTokenUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(token: string): Promise<IRefreshTokenResponse> {
    let payload: { sub: string; pwdAt: string | null; type: string };

    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (payload.type !== 'refresh') throw new UnauthorizedException('Invalid token type');

    const user = await this.userRepository.findById(payload.sub);
    if (!user) throw new UnauthorizedException('User not found');
    const currentPwdAt = user.passwordChangedAt?.toISOString() ?? null;

    if (currentPwdAt !== payload.pwdAt) {
      throw new UnauthorizedException('Session invalidated after password change');
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      churchId: user.churchId,
      type: 'access',
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id, pwdAt: currentPwdAt, type: 'refresh' },
      { expiresIn: '7d' },
    );

    return { accessToken, refreshToken };
  }
}
