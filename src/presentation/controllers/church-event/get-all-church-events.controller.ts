import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAllChurchEventsUsecase } from 'src/application/usecases/church-event/get-all-church-events.usecase';
import { IChurchEvent } from 'src/domain/entities/church-event.entity';
import { PaginatedResult } from 'src/domain/types/paginated-result.type';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { PaginationDto } from 'src/presentation/dtos/common/pagination.dto';

@ApiBearerAuth()
@ApiTags('Church Events')
@Controller('church-events')
export class GetAllChurchEventsController {
  constructor(
    private readonly getAllChurchEventsUsecase: GetAllChurchEventsUsecase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all events of own church' })
  async execute(
    @GetUser() user: IJwtUser,
    @Query() pagination: PaginationDto,
  ): Promise<PaginatedResult<IChurchEvent>> {
    return this.getAllChurchEventsUsecase.execute(
      user.churchId,
      pagination.page ?? 1,
      pagination.limit ?? 10,
    );
  }
}
