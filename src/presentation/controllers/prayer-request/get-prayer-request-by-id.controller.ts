import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetPrayerRequestByIdUsecase } from 'src/application/usecases/prayer-request/get-prayer-request-by-id.usecase';
import { IPrayerRequest } from 'src/domain/entities/prayer-request.entity';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';

@ApiBearerAuth()
@ApiTags('Prayer Requests')
@Controller('prayer-requests')
export class GetPrayerRequestByIdController {
  constructor(private readonly getPrayerRequestByIdUsecase: GetPrayerRequestByIdUsecase) {}

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({ summary: 'Get a prayer request by id' })
  async execute(@Param('id') id: string, @GetUser() user: IJwtUser): Promise<IPrayerRequest> {
    return this.getPrayerRequestByIdUsecase.execute(id, user.churchId);
  }
}
