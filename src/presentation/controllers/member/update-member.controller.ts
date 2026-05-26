import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateMemberUsecase } from 'src/application/usecases/member/update-member.usecase';
import { IMember } from 'src/domain/entities/member.entity';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';
import { UpdateMemberDto } from 'src/presentation/dtos/member/update-member.dto';

@ApiTags('Members')
@Controller('members')
export class UpdateMemberController {
  constructor(private readonly updateMemberUsecase: UpdateMemberUsecase) {}

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({ summary: 'Update a member' })
  async execute(@Param('id') id: string, @Body() body: UpdateMemberDto, @GetUser() user: IJwtUser): Promise<IMember> {
    return this.updateMemberUsecase.execute(
      id,
      {
        name: body.name,
        phone: body.phone,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
      },
      user.churchId,
    );
  }
}
