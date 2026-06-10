import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AcceptInviteUsecase } from 'src/application/usecases/invite/accept-invite.usecase';
import { IUserResponse } from 'src/domain/repositories/user.repository';
import { Public } from 'src/infra/config/jwt/public.decorator';
import { AcceptInviteDto } from 'src/presentation/dtos/invite/accept-invite.dto';

@ApiTags('Invites')
@Controller('invites')
export class AcceptInviteController {
  constructor(private readonly acceptInviteUsecase: AcceptInviteUsecase) {}

  @Post(':token/accept')
  @Public()
  @ApiOperation({ summary: 'Accept an invite and create a supervisor account' })
  async execute(
    @Param('token') token: string,
    @Body() body: AcceptInviteDto,
  ): Promise<IUserResponse> {
    return this.acceptInviteUsecase.execute(token, body);
  }
}
