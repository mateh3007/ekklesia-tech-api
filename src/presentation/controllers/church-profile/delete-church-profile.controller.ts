import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteChurchProfileUsecase } from 'src/application/usecases/church-profile/delete-church-profile.usecase';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';

@ApiBearerAuth()
@ApiTags('Church Profile')
@Controller('church-profile')
export class DeleteChurchProfileController {
  constructor(
    private readonly deleteChurchProfileUsecase: DeleteChurchProfileUsecase,
  ) {}

  @Delete()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete own church profile' })
  async execute(@GetUser() user: IJwtUser): Promise<void> {
    return this.deleteChurchProfileUsecase.execute(user.churchId);
  }
}
