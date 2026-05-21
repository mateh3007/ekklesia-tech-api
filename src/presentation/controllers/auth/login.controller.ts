import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUsecase, ILoginResponse } from 'src/application/usecases/auth/login.usecase';
import { LoginDto } from 'src/presentation/dtos/auth/login.dto';
import { Public } from 'src/infra/config/jwt/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class LoginController {
  constructor(private readonly loginUsecase: LoginUsecase) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Authenticate and receive JWT token' })
  async execute(@Body() body: LoginDto): Promise<ILoginResponse> {
    return this.loginUsecase.execute(body);
  }
}
