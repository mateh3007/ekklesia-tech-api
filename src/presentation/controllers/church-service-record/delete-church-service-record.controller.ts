import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteChurchServiceRecordUsecase } from 'src/application/usecases/church-service-record/delete-church-service-record.usecase';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';

@ApiBearerAuth()
@ApiTags('Church Service Records')
@Controller('church-service-records')
export class DeleteChurchServiceRecordController {
  constructor(
    private readonly deleteChurchServiceRecordUsecase: DeleteChurchServiceRecordUsecase,
  ) {}

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a church service record' })
  async execute(
    @Param('id') id: string,
    @GetUser() user: IJwtUser,
  ): Promise<void> {
    return this.deleteChurchServiceRecordUsecase.execute(id, user.churchId);
  }
}
