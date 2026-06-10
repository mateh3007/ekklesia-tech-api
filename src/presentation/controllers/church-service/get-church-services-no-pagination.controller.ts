import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetChurchServicesNoPaginationUsecase } from 'src/application/usecases/church-service/get-church-services-no-pagination.usecase';
import { IdName } from 'src/domain/types/id-name.type';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';

@ApiBearerAuth()
@ApiTags('Church Services')
@Controller('church-services')
export class GetChurchServicesNoPaginationController {
  constructor(
    private readonly getChurchServicesNoPaginationUsecase: GetChurchServicesNoPaginationUsecase,
  ) {}

  @Get('no-pagination')
  @ApiOperation({
    summary: 'List all church services (id and name only) without pagination',
  })
  async execute(@GetUser() user: IJwtUser): Promise<IdName[]> {
    return this.getChurchServicesNoPaginationUsecase.execute(user.churchId);
  }
}
