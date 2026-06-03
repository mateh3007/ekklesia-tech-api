import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AssignChurchPermissionUsecase } from 'src/application/usecases/permission/assign-church-permission.usecase';
import { Roles } from 'src/infra/config/rbac/roles.decorator';
import { Role } from 'src/domain/enums/role.enum';
import { AssignChurchPermissionDto } from 'src/presentation/dtos/permission/assign-church-permission.dto';
import { IChurchPermission } from 'src/domain/entities/church-permission.entity';

@ApiBearerAuth()
@ApiTags('Permissions')
@Controller('church-permissions')
export class AssignChurchPermissionController {
  constructor(private readonly assignChurchPermissionUsecase: AssignChurchPermissionUsecase) {}

  @Post()
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: 'Assign a permission to a church (SUPERADMIN only)' })
  async execute(@Body() dto: AssignChurchPermissionDto): Promise<IChurchPermission> {
    return this.assignChurchPermissionUsecase.execute(dto.churchId, dto.permissionId);
  }
}
