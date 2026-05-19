import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUserByIdUsecase } from 'src/application/usecases/user/get-user-by-id.usecase';
import { IUserResponse } from 'src/domain/repositories/user.repository';

@ApiTags('Users')
@Controller('users')
export class GetUserByIdController {
  constructor(private readonly getUserByIdUsecase: GetUserByIdUsecase) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async execute(@Param('id') id: string): Promise<IUserResponse> {
    return this.getUserByIdUsecase.execute(id);
  }
}
