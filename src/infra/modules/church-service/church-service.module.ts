import { Module } from '@nestjs/common';
import { CreateChurchServiceUsecase } from 'src/application/usecases/church-service/create-church-service.usecase';
import { DeleteChurchServiceUsecase } from 'src/application/usecases/church-service/delete-church-service.usecase';
import { GetAllChurchServicesUsecase } from 'src/application/usecases/church-service/get-all-church-services.usecase';
import { GetChurchServiceByIdUsecase } from 'src/application/usecases/church-service/get-church-service-by-id.usecase';
import { UpdateChurchServiceUsecase } from 'src/application/usecases/church-service/update-church-service.usecase';
import { ChurchServiceRepository } from 'src/domain/repositories/church-service.repository';
import { PrismaChurchServiceRepository } from 'src/infra/repositories/prisma-church-service.repository';
import { CreateChurchServiceController } from 'src/presentation/controllers/church-service/create-church-service.controller';
import { DeleteChurchServiceController } from 'src/presentation/controllers/church-service/delete-church-service.controller';
import { GetAllChurchServicesController } from 'src/presentation/controllers/church-service/get-all-church-services.controller';
import { GetChurchServiceByIdController } from 'src/presentation/controllers/church-service/get-church-service-by-id.controller';
import { UpdateChurchServiceController } from 'src/presentation/controllers/church-service/update-church-service.controller';

@Module({
  providers: [
    CreateChurchServiceUsecase,
    GetAllChurchServicesUsecase,
    GetChurchServiceByIdUsecase,
    UpdateChurchServiceUsecase,
    DeleteChurchServiceUsecase,
    PrismaChurchServiceRepository,
    {
      provide: ChurchServiceRepository,
      useExisting: PrismaChurchServiceRepository,
    },
  ],
  controllers: [
    CreateChurchServiceController,
    GetAllChurchServicesController,
    GetChurchServiceByIdController,
    UpdateChurchServiceController,
    DeleteChurchServiceController,
  ],
})
export class ChurchServiceModule {}
