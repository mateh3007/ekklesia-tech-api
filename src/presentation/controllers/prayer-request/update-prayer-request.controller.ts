import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdatePrayerRequestUsecase } from 'src/application/usecases/prayer-request/update-prayer-request.usecase';
import { IPrayerRequest } from 'src/domain/entities/prayer-request.entity';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';
import { UpdatePrayerRequestDto } from 'src/presentation/dtos/prayer-request/update-prayer-request.dto';

@ApiBearerAuth()
@ApiTags('Prayer Requests')
@Controller('prayer-requests')
export class UpdatePrayerRequestController {
  constructor(private readonly updatePrayerRequestUsecase: UpdatePrayerRequestUsecase) {}

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({ summary: 'Update a prayer request' })
  async execute(
    @Param('id') id: string,
    @Body() body: UpdatePrayerRequestDto,
    @GetUser() user: IJwtUser,
  ): Promise<IPrayerRequest> {
    return this.updatePrayerRequestUsecase.execute(id, body, user.churchId);
  }
}
