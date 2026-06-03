import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMemberUsecase } from 'src/application/usecases/member/create-member.usecase';
import { IMember } from 'src/domain/entities/member.entity';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';
import { CreateMemberDto } from 'src/presentation/dtos/member/create-member.dto';

@ApiBearerAuth()
@ApiTags('Members')
@Controller('members')
export class CreateMemberController {
  constructor(private readonly createMemberUsecase: CreateMemberUsecase) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({ summary: 'Create a new member in own church' })
  async execute(@Body() body: CreateMemberDto, @GetUser() user: IJwtUser): Promise<IMember> {
    return this.createMemberUsecase.execute({ ...body, dateOfBirth: new Date(body.dateOfBirth) }, user.churchId);
  }
}
