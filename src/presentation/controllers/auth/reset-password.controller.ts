import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResetPasswordUsecase } from 'src/application/usecases/auth/reset-password.usecase';
import { ResetPasswordDto } from 'src/presentation/dtos/auth/reset-password.dto';
import { Public } from 'src/infra/config/jwt/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class ResetPasswordController {
  constructor(private readonly resetPasswordUsecase: ResetPasswordUsecase) {}

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using token from email' })
  async execute(@Body() body: ResetPasswordDto): Promise<void> {
    return this.resetPasswordUsecase.execute(body);
  }
}
