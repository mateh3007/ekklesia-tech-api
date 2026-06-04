import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteAnnouncementUsecase } from 'src/application/usecases/announcement/delete-announcement.usecase';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';

@ApiBearerAuth()
@ApiTags('Announcements')
@Controller('announcements')
export class DeleteAnnouncementController {
  constructor(
    private readonly deleteAnnouncementUsecase: DeleteAnnouncementUsecase,
  ) {}

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete an announcement' })
  async execute(
    @Param('id') id: string,
    @GetUser() user: IJwtUser,
  ): Promise<void> {
    return this.deleteAnnouncementUsecase.execute(id, user.churchId);
  }
}
