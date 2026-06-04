import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUserByIdUsecase } from 'src/application/usecases/user/get-user-by-id.usecase';
import { IUserResponse } from 'src/domain/repositories/user.repository';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';
import { Role } from 'src/domain/enums/role.enum';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class GetUserByIdController {
  constructor(private readonly getUserByIdUsecase: GetUserByIdUsecase) {}

  @Roles(Role.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async execute(
    @Param('id') id: string,
    @GetUser() user: IJwtUser,
  ): Promise<IUserResponse> {
    return this.getUserByIdUsecase.execute(id, user.churchId);
  }
}
