import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAgendaUsecase } from 'src/application/usecases/agenda/get-agenda.usecase';
import type { IAgenda } from 'src/application/usecases/agenda/get-agenda.usecase';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';
import { GetAgendaQueryDto } from 'src/presentation/dtos/agenda/get-agenda-query.dto';

@ApiBearerAuth()
@ApiTags('Agenda')
@Controller('churches')
export class GetAgendaController {
  constructor(private readonly getAgendaUsecase: GetAgendaUsecase) {}

  @Get(':churchId/agenda')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({
    summary: 'Get church agenda (services, events and birthdays)',
  })
  async execute(
    @Param('churchId') churchId: string,
    @Query() query: GetAgendaQueryDto,
    @GetUser() user: IJwtUser,
  ): Promise<IAgenda> {
    if (user.role !== Role.SUPERADMIN && user.churchId !== churchId) {
      throw new ForbiddenException('Access denied to this church');
    }
    return this.getAgendaUsecase.execute(churchId, query.filter, query.date);
  }
}
