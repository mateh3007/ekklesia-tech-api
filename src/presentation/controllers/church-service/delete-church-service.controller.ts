import { Controller, Delete, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteChurchServiceUsecase } from 'src/application/usecases/church-service/delete-church-service.usecase';
import { Roles } from 'src/infra/config/rbac/roles.decorator';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';

@ApiTags('Church Services')
@Controller('church-services')
export class DeleteChurchServiceController {
  constructor(private readonly deleteChurchServiceUsecase: DeleteChurchServiceUsecase) {}

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a church service' })
  async execute(@Param('id') id: string, @GetUser() user: IJwtUser): Promise<void> {
    return this.deleteChurchServiceUsecase.execute(id, user.churchId);
  }
}
