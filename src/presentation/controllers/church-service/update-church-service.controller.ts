import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateChurchServiceUsecase } from 'src/application/usecases/church-service/update-church-service.usecase';
import { IChurchService } from 'src/domain/entities/church-service.entity';
import { Roles } from 'src/infra/config/rbac/roles.decorator';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { UpdateChurchServiceDto } from 'src/presentation/dtos/church-service/update-church-service.dto';

@ApiTags('Church Services')
@Controller('church-services')
export class UpdateChurchServiceController {
  constructor(private readonly updateChurchServiceUsecase: UpdateChurchServiceUsecase) {}

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a church service' })
  async execute(@Param('id') id: string, @Body() body: UpdateChurchServiceDto, @GetUser() user: IJwtUser): Promise<IChurchService> {
    return this.updateChurchServiceUsecase.execute(id, body, user.churchId);
  }
}
