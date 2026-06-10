import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetMembersNoPaginationUsecase } from 'src/application/usecases/member/get-members-no-pagination.usecase';
import { Role } from 'src/domain/enums/role.enum';
import { IdName } from 'src/domain/types/id-name.type';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';

@ApiBearerAuth()
@ApiTags('Members')
@Controller('members')
export class GetMembersNoPaginationController {
  constructor(
    private readonly getMembersNoPaginationUsecase: GetMembersNoPaginationUsecase,
  ) {}

  @Get('no-pagination')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({
    summary: 'List all members (id and name only) without pagination',
  })
  async execute(@GetUser() user: IJwtUser): Promise<IdName[]> {
    return this.getMembersNoPaginationUsecase.execute(user.churchId);
  }
}
