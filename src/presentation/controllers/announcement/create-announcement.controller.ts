import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAnnouncementUsecase } from 'src/application/usecases/announcement/create-announcement.usecase';
import { IAnnouncement } from 'src/domain/entities/announcement.entity';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';
import { CreateAnnouncementDto } from 'src/presentation/dtos/announcement/create-announcement.dto';

@ApiBearerAuth()
@ApiTags('Announcements')
@Controller('announcements')
export class CreateAnnouncementController {
  constructor(private readonly createAnnouncementUsecase: CreateAnnouncementUsecase) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({ summary: 'Create a new announcement' })
  async execute(@Body() body: CreateAnnouncementDto, @GetUser() user: IJwtUser): Promise<IAnnouncement> {
    return this.createAnnouncementUsecase.execute({
      ...body,
      churchId: user.churchId,
      authorId: user.id,
      date: new Date(body.date),
    });
  }
}
