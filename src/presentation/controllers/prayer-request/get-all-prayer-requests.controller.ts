import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAllPrayerRequestsUsecase } from 'src/application/usecases/prayer-request/get-all-prayer-requests.usecase';
import { IPrayerRequest } from 'src/domain/entities/prayer-request.entity';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';

@ApiBearerAuth()
@ApiTags('Prayer Requests')
@Controller('prayer-requests')
export class GetAllPrayerRequestsController {
  constructor(
    private readonly getAllPrayerRequestsUsecase: GetAllPrayerRequestsUsecase,
  ) {}

  @Get()
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({
    summary: 'List all prayer requests ordered by createdAt descending',
  })
  async execute(@GetUser() user: IJwtUser): Promise<IPrayerRequest[]> {
    return this.getAllPrayerRequestsUsecase.execute(user.churchId);
  }
}
