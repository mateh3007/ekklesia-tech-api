import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateChurchProfileUsecase } from 'src/application/usecases/church-profile/create-church-profile.usecase';
import { IChurchProfile } from 'src/domain/entities/church-profile.entity';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { Roles } from 'src/infra/config/rbac/roles.decorator';
import { CreateChurchProfileDto } from 'src/presentation/dtos/church-profile/create-church-profile.dto';

@ApiBearerAuth()
@ApiTags('Church Profile')
@Controller('church-profile')
export class CreateChurchProfileController {
  constructor(
    private readonly createChurchProfileUsecase: CreateChurchProfileUsecase,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ summary: 'Create church profile (called on onboarding)' })
  async execute(
    @Body() body: CreateChurchProfileDto,
    @GetUser() user: IJwtUser,
  ): Promise<IChurchProfile> {
    return this.createChurchProfileUsecase.execute({
      ...body,
      churchId: user.churchId,
      foundedAt: body.foundedAt ? new Date(body.foundedAt) : undefined,
    });
  }
}
