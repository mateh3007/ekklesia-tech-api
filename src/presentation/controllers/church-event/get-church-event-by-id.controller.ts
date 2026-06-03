import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetChurchEventByIdUsecase } from 'src/application/usecases/church-event/get-church-event-by-id.usecase';
import { IChurchEvent } from 'src/domain/entities/church-event.entity';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';

@ApiBearerAuth()
@ApiTags('Church Events')
@Controller('church-events')
export class GetChurchEventByIdController {
  constructor(private readonly getChurchEventByIdUsecase: GetChurchEventByIdUsecase) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get church event by ID' })
  async execute(@Param('id') id: string, @GetUser() user: IJwtUser): Promise<IChurchEvent> {
    return this.getChurchEventByIdUsecase.execute(id, user.churchId);
  }
}
