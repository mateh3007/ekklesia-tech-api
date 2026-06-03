import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateInviteUsecase } from 'src/application/usecases/invite/create-invite.usecase';
import type { IChurchInvite } from 'src/application/usecases/invite/create-invite.usecase';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';
import { CreateInviteDto } from 'src/presentation/dtos/invite/create-invite.dto';

@ApiBearerAuth()
@ApiTags('Invites')
@Controller('churches')
export class CreateInviteController {
  constructor(private readonly createInviteUsecase: CreateInviteUsecase) {}

  @Post(':churchId/invites')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Send a supervisor invite to an email' })
  async execute(
    @Param('churchId') churchId: string,
    @Body() body: CreateInviteDto,
    @GetUser() user: IJwtUser,
  ): Promise<IChurchInvite> {
    return this.createInviteUsecase.execute(churchId, body.email, user);
  }
}
