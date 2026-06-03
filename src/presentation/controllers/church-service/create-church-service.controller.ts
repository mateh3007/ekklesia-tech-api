import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateChurchServiceUsecase } from 'src/application/usecases/church-service/create-church-service.usecase';
import { IChurchService } from 'src/domain/entities/church-service.entity';
import { Roles } from 'src/infra/config/rbac/roles.decorator';
import { Role } from 'src/domain/enums/role.enum';
import { GetUser } from 'src/infra/config/jwt/get-user.decorator';
import type { IJwtUser } from 'src/infra/config/jwt/get-user.decorator';
import { CreateChurchServiceDto } from 'src/presentation/dtos/church-service/create-church-service.dto';

@ApiBearerAuth()
@ApiTags('Church Services')
@Controller('church-services')
export class CreateChurchServiceController {
  constructor(private readonly createChurchServiceUsecase: CreateChurchServiceUsecase) {}

  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new church service' })
  async execute(@Body() body: CreateChurchServiceDto, @GetUser() user: IJwtUser): Promise<IChurchService> {
    return this.createChurchServiceUsecase.execute({ ...body, churchId: user.churchId });
  }
}
