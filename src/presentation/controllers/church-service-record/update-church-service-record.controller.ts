import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateChurchServiceRecordUsecase } from 'src/application/usecases/church-service-record/update-church-service-record.usecase';
import { IChurchServiceRecord } from 'src/domain/entities/church-service-record.entity';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';
import { UpdateChurchServiceRecordDto } from 'src/presentation/dtos/church-service-record/update-church-service-record.dto';

@ApiBearerAuth()
@ApiTags('Church Service Records')
@Controller('church-service-records')
export class UpdateChurchServiceRecordController {
  constructor(
    private readonly updateChurchServiceRecordUsecase: UpdateChurchServiceRecordUsecase,
  ) {}

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({ summary: 'Update a church service record' })
  async execute(
    @Param('id') id: string,
    @Body() body: UpdateChurchServiceRecordDto,
    @GetUser() user: IJwtUser,
  ): Promise<IChurchServiceRecord> {
    return this.updateChurchServiceRecordUsecase.execute(
      id,
      { ...body, date: body.date ? new Date(body.date) : undefined },
      user.churchId,
    );
  }
}
