import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RefreshTokenUsecase } from 'src/application/usecases/auth/refresh-token.usecase';
import { Public } from 'src/infra/config/jwt/public.decorator';
import { RefreshTokenDto } from 'src/presentation/dtos/auth/refresh-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class RefreshTokenController {
  constructor(private readonly refreshTokenUsecase: RefreshTokenUsecase) {}

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Rotate refresh token and get new access token' })
  async execute(
    @Body() body: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.refreshTokenUsecase.execute(body.refreshToken);
  }
}
