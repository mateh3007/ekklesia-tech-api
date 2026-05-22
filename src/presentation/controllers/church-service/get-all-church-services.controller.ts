import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAllChurchServicesUsecase } from 'src/application/usecases/church-service/get-all-church-services.usecase';
import { IChurchService } from 'src/domain/entities/church-service.entity';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';

@ApiTags('Church Services')
@Controller('church-services')
export class GetAllChurchServicesController {
  constructor(private readonly getAllChurchServicesUsecase: GetAllChurchServicesUsecase) {}

  @Get()
  @ApiOperation({ summary: 'List all services of own church' })
  async execute(@GetUser() user: IJwtUser): Promise<IChurchService[]> {
    return this.getAllChurchServicesUsecase.execute(user.churchId);
  }
}
