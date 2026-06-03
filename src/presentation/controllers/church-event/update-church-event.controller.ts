import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateChurchEventUsecase } from 'src/application/usecases/church-event/update-church-event.usecase';
import { IChurchEvent } from 'src/domain/entities/church-event.entity';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';
import { UpdateChurchEventDto } from 'src/presentation/dtos/church-event/update-church-event.dto';

@ApiBearerAuth()
@ApiTags('Church Events')
@Controller('church-events')
export class UpdateChurchEventController {
  constructor(private readonly updateChurchEventUsecase: UpdateChurchEventUsecase) {}

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a church event' })
  async execute(@Param('id') id: string, @Body() body: UpdateChurchEventDto, @GetUser() user: IJwtUser): Promise<IChurchEvent> {
    return this.updateChurchEventUsecase.execute(id, body, user.churchId);
  }
}
