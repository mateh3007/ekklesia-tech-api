import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAllAnnouncementsUsecase } from 'src/application/usecases/announcement/get-all-announcements.usecase';
import { IAnnouncement } from 'src/domain/entities/announcement.entity';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';

@ApiBearerAuth()
@ApiTags('Announcements')
@Controller('announcements')
export class GetAllAnnouncementsController {
  constructor(
    private readonly getAllAnnouncementsUsecase: GetAllAnnouncementsUsecase,
  ) {}

  @Get()
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({
    summary: 'List all announcements ordered by createdAt descending',
  })
  async execute(@GetUser() user: IJwtUser): Promise<IAnnouncement[]> {
    return this.getAllAnnouncementsUsecase.execute(user.churchId);
  }
}
