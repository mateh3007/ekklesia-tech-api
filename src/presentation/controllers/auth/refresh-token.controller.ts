import {
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { RefreshTokenUsecase } from 'src/application/usecases/auth/refresh-token.usecase';
import { Public } from 'src/infra/config/jwt/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class RefreshTokenController {
  constructor(private readonly refreshTokenUsecase: RefreshTokenUsecase) {}

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Rotate refresh token and get new access token' })
  async execute(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const cookies = req.cookies as Record<string, string | undefined>;
    const token = cookies['refresh_token'];
    if (!token) throw new UnauthorizedException('No refresh token provided');

    const { accessToken, refreshToken } =
      await this.refreshTokenUsecase.execute(token);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }
}
