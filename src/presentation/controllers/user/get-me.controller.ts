import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetMeUsecase } from 'src/application/usecases/user/get-me.usecase';
import { IUserResponse } from 'src/domain/repositories/user.repository';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';

@ApiTags('Users')
@Controller('users')
export class GetMeController {
  constructor(private readonly getMeUsecase: GetMeUsecase) {}

  @Get('me')
  @ApiOperation({ summary: 'Get own profile' })
  async execute(@GetUser() user: IJwtUser): Promise<IUserResponse> {
    return this.getMeUsecase.execute(user.id);
  }
}
