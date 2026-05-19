import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserUsecase } from 'src/application/usecases/user/update-user.usecase';
import { IUserResponse } from 'src/domain/repositories/user.repository';
import { UpdateUserDto } from 'src/presentation/dtos/user/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UpdateUserController {
  constructor(private readonly updateUserUsecase: UpdateUserUsecase) {}

  @Patch(':id')
  @ApiOperation({ summary: 'Update user data' })
  async execute(@Param('id') id: string, @Body() body: UpdateUserDto): Promise<IUserResponse> {
    return this.updateUserUsecase.execute(id, body);
  }
}
