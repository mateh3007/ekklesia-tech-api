import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteUserUsecase } from 'src/application/usecases/user/delete-user.usecase';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';
import { Role } from 'src/domain/enums/role.enum';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class DeleteUserController {
  constructor(private readonly deleteUserUsecase: DeleteUserUsecase) {}

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user' })
  async execute(
    @Param('id') id: string,
    @GetUser() user: IJwtUser,
  ): Promise<void> {
    return this.deleteUserUsecase.execute(id, user.churchId);
  }
}
