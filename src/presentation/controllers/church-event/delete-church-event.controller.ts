import { Controller, Delete, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteChurchEventUsecase } from 'src/application/usecases/church-event/delete-church-event.usecase';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';

@ApiTags('Church Events')
@Controller('church-events')
export class DeleteChurchEventController {
  constructor(private readonly deleteChurchEventUsecase: DeleteChurchEventUsecase) {}

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a church event' })
  async execute(@Param('id') id: string, @GetUser() user: IJwtUser): Promise<void> {
    return this.deleteChurchEventUsecase.execute(id, user.churchId);
  }
}
