import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  GetMyChurchUsecase,
  IMyChurchResponse,
} from 'src/application/usecases/church/get-my-church.usecase';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';

@ApiBearerAuth()
@ApiTags('Church')
@Controller('church')
export class GetMyChurchController {
  constructor(private readonly getMyChurchUsecase: GetMyChurchUsecase) {}

  @Get('me')
  @ApiOperation({ summary: 'Get own church info with users' })
  async execute(@GetUser() user: IJwtUser): Promise<IMyChurchResponse> {
    return this.getMyChurchUsecase.execute(user.churchId);
  }
}
