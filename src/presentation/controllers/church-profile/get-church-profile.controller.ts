import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetChurchProfileUsecase } from 'src/application/usecases/church-profile/get-church-profile.usecase';
import { IChurchProfile } from 'src/domain/entities/church-profile.entity';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';

@ApiBearerAuth()
@ApiTags('Church Profile')
@Controller('church-profile')
export class GetChurchProfileController {
  constructor(private readonly getChurchProfileUsecase: GetChurchProfileUsecase) {}

  @Get()
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({ summary: 'Get own church profile' })
  async execute(@GetUser() user: IJwtUser): Promise<IChurchProfile> {
    return this.getChurchProfileUsecase.execute(user.churchId);
  }
}
