import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetChurchServiceByIdUsecase } from 'src/application/usecases/church-service/get-church-service-by-id.usecase';
import { IChurchService } from 'src/domain/entities/church-service.entity';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';

@ApiBearerAuth()
@ApiTags('Church Services')
@Controller('church-services')
export class GetChurchServiceByIdController {
  constructor(private readonly getChurchServiceByIdUsecase: GetChurchServiceByIdUsecase) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get church service by ID' })
  async execute(@Param('id') id: string, @GetUser() user: IJwtUser): Promise<IChurchService> {
    return this.getChurchServiceByIdUsecase.execute(id, user.churchId);
  }
}
