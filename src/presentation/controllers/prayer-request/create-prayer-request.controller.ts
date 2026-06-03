import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePrayerRequestUsecase } from 'src/application/usecases/prayer-request/create-prayer-request.usecase';
import { IPrayerRequest } from 'src/domain/entities/prayer-request.entity';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';
import { CreatePrayerRequestDto } from 'src/presentation/dtos/prayer-request/create-prayer-request.dto';

@ApiBearerAuth()
@ApiTags('Prayer Requests')
@Controller('prayer-requests')
export class CreatePrayerRequestController {
  constructor(private readonly createPrayerRequestUsecase: CreatePrayerRequestUsecase) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({ summary: 'Create a new prayer request' })
  async execute(@Body() body: CreatePrayerRequestDto, @GetUser() user: IJwtUser): Promise<IPrayerRequest> {
    return this.createPrayerRequestUsecase.execute({
      ...body,
      churchId: user.churchId,
      authorId: user.id,
    });
  }
}
