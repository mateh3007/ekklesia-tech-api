import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAnnouncementByIdUsecase } from 'src/application/usecases/announcement/get-announcement-by-id.usecase';
import { IAnnouncement } from 'src/domain/entities/announcement.entity';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';

@ApiBearerAuth()
@ApiTags('Announcements')
@Controller('announcements')
export class GetAnnouncementByIdController {
  constructor(private readonly getAnnouncementByIdUsecase: GetAnnouncementByIdUsecase) {}

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({ summary: 'Get an announcement by id' })
  async execute(@Param('id') id: string, @GetUser() user: IJwtUser): Promise<IAnnouncement> {
    return this.getAnnouncementByIdUsecase.execute(id, user.churchId);
  }
}
