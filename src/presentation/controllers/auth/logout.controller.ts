import { Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { Public } from 'src/infra/config/jwt/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class LogoutController {
  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke refresh token and clear session cookie' })
  execute(@Res({ passthrough: true }) res: Response): void {
    res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'strict' });
  }
}
