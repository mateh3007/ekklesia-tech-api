import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAllUsersUsecase } from 'src/application/usecases/user/get-all-users.usecase';
import { IUserResponse } from 'src/domain/repositories/user.repository';

@ApiTags('Users')
@Controller('users')
export class GetAllUsersController {
  constructor(private readonly getAllUsersUsecase: GetAllUsersUsecase) {}

  @Get()
  @ApiOperation({ summary: 'List all users' })
  async execute(): Promise<IUserResponse[]> {
    return this.getAllUsersUsecase.execute();
  }
}
