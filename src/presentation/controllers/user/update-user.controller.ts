import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserUsecase } from 'src/application/usecases/user/update-user.usecase';
import { IUserResponse } from 'src/domain/repositories/user.repository';
import { UpdateUserDto } from 'src/presentation/dtos/user/update-user.dto';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';

@ApiTags('Users')
@Controller('users')
export class UpdateUserController {
  constructor(private readonly updateUserUsecase: UpdateUserUsecase) {}

  @Patch(':id')
  @ApiOperation({ summary: 'Update user data' })
  async execute(@Param('id') id: string, @Body() body: UpdateUserDto, @GetUser() user: IJwtUser): Promise<IUserResponse> {
    return this.updateUserUsecase.execute(id, body, user.churchId);
  }
}
