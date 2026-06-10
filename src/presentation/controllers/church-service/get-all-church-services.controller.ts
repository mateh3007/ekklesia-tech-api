import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAllChurchServicesUsecase } from 'src/application/usecases/church-service/get-all-church-services.usecase';
import { IChurchService } from 'src/domain/entities/church-service.entity';
import { PaginatedResult } from 'src/domain/types/paginated-result.type';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { PaginationDto } from 'src/presentation/dtos/common/pagination.dto';

@ApiBearerAuth()
@ApiTags('Church Services')
@Controller('church-services')
export class GetAllChurchServicesController {
  constructor(
    private readonly getAllChurchServicesUsecase: GetAllChurchServicesUsecase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all services of own church' })
  async execute(
    @GetUser() user: IJwtUser,
    @Query() pagination: PaginationDto,
  ): Promise<PaginatedResult<IChurchService>> {
    return this.getAllChurchServicesUsecase.execute(
      user.churchId,
      pagination.page ?? 1,
      pagination.limit ?? 10,
    );
  }
}
