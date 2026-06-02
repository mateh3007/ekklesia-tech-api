import { Module } from '@nestjs/common';
import { CreatePrayerRequestUsecase } from 'src/application/usecases/prayer-request/create-prayer-request.usecase';
import { DeletePrayerRequestUsecase } from 'src/application/usecases/prayer-request/delete-prayer-request.usecase';
import { GetAllPrayerRequestsUsecase } from 'src/application/usecases/prayer-request/get-all-prayer-requests.usecase';
import { GetPrayerRequestByIdUsecase } from 'src/application/usecases/prayer-request/get-prayer-request-by-id.usecase';
import { UpdatePrayerRequestUsecase } from 'src/application/usecases/prayer-request/update-prayer-request.usecase';
import { PrayerRequestRepository } from 'src/domain/repositories/prayer-request.repository';
import { PrismaPrayerRequestRepository } from 'src/infra/repositories/prisma-prayer-request.repository';
import { CreatePrayerRequestController } from 'src/presentation/controllers/prayer-request/create-prayer-request.controller';
import { DeletePrayerRequestController } from 'src/presentation/controllers/prayer-request/delete-prayer-request.controller';
import { GetAllPrayerRequestsController } from 'src/presentation/controllers/prayer-request/get-all-prayer-requests.controller';
import { GetPrayerRequestByIdController } from 'src/presentation/controllers/prayer-request/get-prayer-request-by-id.controller';
import { UpdatePrayerRequestController } from 'src/presentation/controllers/prayer-request/update-prayer-request.controller';

@Module({
  providers: [
    CreatePrayerRequestUsecase,
    GetAllPrayerRequestsUsecase,
    GetPrayerRequestByIdUsecase,
    UpdatePrayerRequestUsecase,
    DeletePrayerRequestUsecase,
    PrismaPrayerRequestRepository,
    {
      provide: PrayerRequestRepository,
      useExisting: PrismaPrayerRequestRepository,
    },
  ],
  controllers: [
    CreatePrayerRequestController,
    GetAllPrayerRequestsController,
    GetPrayerRequestByIdController,
    UpdatePrayerRequestController,
    DeletePrayerRequestController,
  ],
})
export class PrayerRequestModule {}
