import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAllUsersUsecase } from 'src/application/usecases/user/get-all-users.usecase';
import { IUserResponse } from 'src/domain/repositories/user.repository';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';
import { Role } from 'src/domain/enums/role.enum';

@ApiTags('Users')
@Controller('users')
export class GetAllUsersController {
  constructor(private readonly getAllUsersUsecase: GetAllUsersUsecase) {}

  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'List all users from own church' })
  async execute(@GetUser() user: IJwtUser): Promise<IUserResponse[]> {
    return this.getAllUsersUsecase.execute(user.churchId);
  }
}
