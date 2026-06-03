import { Controller, Delete, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteMemberUsecase } from 'src/application/usecases/member/delete-member.usecase';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';

@ApiBearerAuth()
@ApiTags('Members')
@Controller('members')
export class DeleteMemberController {
  constructor(private readonly deleteMemberUsecase: DeleteMemberUsecase) {}

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a member' })
  async execute(@Param('id') id: string, @GetUser() user: IJwtUser): Promise<void> {
    return this.deleteMemberUsecase.execute(id, user.churchId);
  }
}
