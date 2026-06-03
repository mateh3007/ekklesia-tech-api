import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAllChurchServiceRecordsUsecase } from 'src/application/usecases/church-service-record/get-all-church-service-records.usecase';
import { IChurchServiceRecord } from 'src/domain/entities/church-service-record.entity';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';

@ApiBearerAuth()
@ApiTags('Church Service Records')
@Controller('church-service-records')
export class GetAllChurchServiceRecordsController {
  constructor(private readonly getAllChurchServiceRecordsUsecase: GetAllChurchServiceRecordsUsecase) {}

  @Get()
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({ summary: 'List all church service records ordered by date descending' })
  async execute(@GetUser() user: IJwtUser): Promise<IChurchServiceRecord[]> {
    return this.getAllChurchServiceRecordsUsecase.execute(user.churchId);
  }
}
