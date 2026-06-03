import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { LoginUsecase } from 'src/application/usecases/auth/login.usecase';
import { LoginDto } from 'src/presentation/dtos/auth/login.dto';
import { Public } from 'src/infra/config/jwt/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class LoginController {
  constructor(private readonly loginUsecase: LoginUsecase) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Authenticate and receive JWT token' })
  async execute(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } = await this.loginUsecase.execute(body);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }
}
