import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetLatestChurchServiceRecordUsecase } from 'src/application/usecases/church-service-record/get-latest-church-service-record.usecase';
import { IChurchServiceRecord } from 'src/domain/entities/church-service-record.entity';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';

@ApiTags('Church Service Records')
@Controller('church-service-records')
export class GetLatestChurchServiceRecordController {
  constructor(private readonly getLatestChurchServiceRecordUsecase: GetLatestChurchServiceRecordUsecase) {}

  @Get('latest')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({ summary: 'Get the most recent church service record (dashboard)' })
  async execute(@GetUser() user: IJwtUser): Promise<IChurchServiceRecord | null> {
    return this.getLatestChurchServiceRecordUsecase.execute(user.churchId);
  }
}
