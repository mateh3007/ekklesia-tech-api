import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserUsecase } from 'src/application/usecases/user/create-user.usecase';
import { IUserResponse } from 'src/domain/repositories/user.repository';
import { CreateUserDto } from 'src/presentation/dtos/user/create-user.dto';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';
import { Role } from 'src/domain/enums/role.enum';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class CreateUserController {
  constructor(private readonly createUserUsecase: CreateUserUsecase) {}

  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new employee or user in own church' })
  async execute(
    @Body() body: CreateUserDto,
    @GetUser() user: IJwtUser,
  ): Promise<IUserResponse> {
    return this.createUserUsecase.execute(body, user.churchId);
  }
}
