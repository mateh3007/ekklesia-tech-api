import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ForgotPasswordUsecase } from 'src/application/usecases/auth/forgot-password.usecase';
import { ForgotPasswordDto } from 'src/presentation/dtos/auth/forgot-password.dto';
import { Public } from 'src/infra/config/jwt/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordUsecase: ForgotPasswordUsecase) {}

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset email' })
  async execute(@Body() body: ForgotPasswordDto): Promise<void> {
    return this.forgotPasswordUsecase.execute(body.email);
  }
}
