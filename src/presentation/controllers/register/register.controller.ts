import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { RegisterUsecase } from 'src/application/usecases/register/register.usecase';
import { RegisterDto } from 'src/presentation/dtos/register/register.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from 'src/infra/config/jwt/public.decorator';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerUsecase: RegisterUsecase) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { ttl: 900000, limit: 5 } })
  @ApiOperation({ summary: 'Registrar uma nova igreja' })
  @ApiResponse({ status: 201, description: 'Igreja registrada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao registrar a igreja' })
  @ApiResponse({
    status: 429,
    description: 'Muitas tentativas. Tente novamente em 15 minutos.',
  })
  @ApiBody({ type: RegisterDto })
  async execute(@Body() body: RegisterDto): Promise<void> {
    await this.registerUsecase.execute(body);
  }
}
