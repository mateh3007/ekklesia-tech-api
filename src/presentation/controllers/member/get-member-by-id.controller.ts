import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetMemberByIdUsecase } from 'src/application/usecases/member/get-member-by-id.usecase';
import { IMember } from 'src/domain/entities/member.entity';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';

@ApiBearerAuth()
@ApiTags('Members')
@Controller('members')
export class GetMemberByIdController {
  constructor(private readonly getMemberByIdUsecase: GetMemberByIdUsecase) {}

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({ summary: 'Get a member by id' })
  async execute(@Param('id') id: string, @GetUser() user: IJwtUser): Promise<IMember> {
    return this.getMemberByIdUsecase.execute(id, user.churchId);
  }
}
