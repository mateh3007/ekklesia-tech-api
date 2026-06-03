import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateAnnouncementUsecase } from 'src/application/usecases/announcement/update-announcement.usecase';
import { IAnnouncement } from 'src/domain/entities/announcement.entity';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';
import { UpdateAnnouncementDto } from 'src/presentation/dtos/announcement/update-announcement.dto';

@ApiBearerAuth()
@ApiTags('Announcements')
@Controller('announcements')
export class UpdateAnnouncementController {
  constructor(private readonly updateAnnouncementUsecase: UpdateAnnouncementUsecase) {}

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({ summary: 'Update an announcement' })
  async execute(
    @Param('id') id: string,
    @Body() body: UpdateAnnouncementDto,
    @GetUser() user: IJwtUser,
  ): Promise<IAnnouncement> {
    return this.updateAnnouncementUsecase.execute(
      id,
      { ...body, date: body.date ? new Date(body.date) : undefined },
      user.churchId,
    );
  }
}
