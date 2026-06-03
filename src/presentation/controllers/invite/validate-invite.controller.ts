import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidateInviteUsecase } from 'src/application/usecases/invite/validate-invite.usecase';
import type { IInviteInfo } from 'src/application/usecases/invite/validate-invite.usecase';
import { Public } from 'src/infra/config/jwt/public.decorator';

@ApiTags('Invites')
@Controller('invites')
export class ValidateInviteController {
  constructor(private readonly validateInviteUsecase: ValidateInviteUsecase) {}

  @Get(':token')
  @Public()
  @ApiOperation({ summary: 'Validate an invite token' })
  async execute(@Param('token') token: string): Promise<IInviteInfo> {
    return this.validateInviteUsecase.execute(token);
  }
}
