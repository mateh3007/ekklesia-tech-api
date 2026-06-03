import { Controller, Delete, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeletePrayerRequestUsecase } from 'src/application/usecases/prayer-request/delete-prayer-request.usecase';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';

@ApiBearerAuth()
@ApiTags('Prayer Requests')
@Controller('prayer-requests')
export class DeletePrayerRequestController {
  constructor(private readonly deletePrayerRequestUsecase: DeletePrayerRequestUsecase) {}

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a prayer request' })
  async execute(@Param('id') id: string, @GetUser() user: IJwtUser): Promise<void> {
    return this.deletePrayerRequestUsecase.execute(id, user.churchId);
  }
}
