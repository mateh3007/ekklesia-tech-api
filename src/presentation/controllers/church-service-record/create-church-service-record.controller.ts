import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateChurchServiceRecordUsecase } from 'src/application/usecases/church-service-record/create-church-service-record.usecase';
import { IChurchServiceRecord } from 'src/domain/entities/church-service-record.entity';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';
import { CreateChurchServiceRecordDto } from 'src/presentation/dtos/church-service-record/create-church-service-record.dto';

@ApiBearerAuth()
@ApiTags('Church Service Records')
@Controller('church-service-records')
export class CreateChurchServiceRecordController {
  constructor(private readonly createChurchServiceRecordUsecase: CreateChurchServiceRecordUsecase) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({ summary: 'Register a church service that occurred' })
  async execute(@Body() body: CreateChurchServiceRecordDto, @GetUser() user: IJwtUser): Promise<IChurchServiceRecord> {
    return this.createChurchServiceRecordUsecase.execute({
      ...body,
      churchId: user.churchId,
      date: new Date(body.date),
    });
  }
}
