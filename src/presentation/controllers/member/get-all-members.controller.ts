import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAllMembersUsecase } from 'src/application/usecases/member/get-all-members.usecase';
import { IMember } from 'src/domain/entities/member.entity';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';

@ApiBearerAuth()
@ApiTags('Members')
@Controller('members')
export class GetAllMembersController {
  constructor(private readonly getAllMembersUsecase: GetAllMembersUsecase) {}

  @Get()
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({ summary: 'List all members of own church' })
  async execute(@GetUser() user: IJwtUser): Promise<IMember[]> {
    return this.getAllMembersUsecase.execute(user.churchId);
  }
}
