import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetChurchServiceRecordByIdUsecase } from 'src/application/usecases/church-service-record/get-church-service-record-by-id.usecase';
import { IChurchServiceRecord } from 'src/domain/entities/church-service-record.entity';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';

@ApiBearerAuth()
@ApiTags('Church Service Records')
@Controller('church-service-records')
export class GetChurchServiceRecordByIdController {
  constructor(private readonly getChurchServiceRecordByIdUsecase: GetChurchServiceRecordByIdUsecase) {}

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({ summary: 'Get a church service record by id' })
  async execute(@Param('id') id: string, @GetUser() user: IJwtUser): Promise<IChurchServiceRecord> {
    return this.getChurchServiceRecordByIdUsecase.execute(id, user.churchId);
  }
}
