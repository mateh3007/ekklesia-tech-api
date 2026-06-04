import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateChurchEventUsecase } from 'src/application/usecases/church-event/create-church-event.usecase';
import { IChurchEvent } from 'src/domain/entities/church-event.entity';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';
import { CreateChurchEventDto } from 'src/presentation/dtos/church-event/create-church-event.dto';

@ApiBearerAuth()
@ApiTags('Church Events')
@Controller('church-events')
export class CreateChurchEventController {
  constructor(
    private readonly createChurchEventUsecase: CreateChurchEventUsecase,
  ) {}

  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new church event' })
  async execute(
    @Body() body: CreateChurchEventDto,
    @GetUser() user: IJwtUser,
  ): Promise<IChurchEvent> {
    return this.createChurchEventUsecase.execute({
      ...body,
      churchId: user.churchId,
    });
  }
}
