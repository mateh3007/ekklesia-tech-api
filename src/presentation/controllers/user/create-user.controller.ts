import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserUsecase } from 'src/application/usecases/user/create-user.usecase';
import { IUserResponse } from 'src/domain/repositories/user.repository';
import { CreateUserDto } from 'src/presentation/dtos/user/create-user.dto';

@ApiTags('Users')
@Controller('users')
export class CreateUserController {
  constructor(private readonly createUserUsecase: CreateUserUsecase) {}

  @Post()
  @ApiOperation({ summary: 'Create a new employee or user' })
  async execute(@Body() body: CreateUserDto): Promise<IUserResponse> {
    return this.createUserUsecase.execute(body);
  }
}
