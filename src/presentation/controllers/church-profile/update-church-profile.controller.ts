import { Body, Controller, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateChurchProfileUsecase } from 'src/application/usecases/church-profile/update-church-profile.usecase';
import { IChurchProfile } from 'src/domain/entities/church-profile.entity';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';
import { UpdateChurchProfileDto } from 'src/presentation/dtos/church-profile/update-church-profile.dto';

@ApiTags('Church Profile')
@Controller('church-profile')
export class UpdateChurchProfileController {
  constructor(private readonly updateChurchProfileUsecase: UpdateChurchProfileUsecase) {}

  @Patch()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update own church profile' })
  async execute(@Body() body: UpdateChurchProfileDto, @GetUser() user: IJwtUser): Promise<IChurchProfile> {
    return this.updateChurchProfileUsecase.execute(user.churchId, {
      ...body,
      foundedAt: body.foundedAt ? new Date(body.foundedAt) : undefined,
    });
  }
}
