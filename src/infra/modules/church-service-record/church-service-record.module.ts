import { Module } from '@nestjs/common';
import { CreateChurchServiceRecordUsecase } from 'src/application/usecases/church-service-record/create-church-service-record.usecase';
import { DeleteChurchServiceRecordUsecase } from 'src/application/usecases/church-service-record/delete-church-service-record.usecase';
import { GetAllChurchServiceRecordsUsecase } from 'src/application/usecases/church-service-record/get-all-church-service-records.usecase';
import { GetChurchServiceRecordByIdUsecase } from 'src/application/usecases/church-service-record/get-church-service-record-by-id.usecase';
import { GetLatestChurchServiceRecordUsecase } from 'src/application/usecases/church-service-record/get-latest-church-service-record.usecase';
import { UpdateChurchServiceRecordUsecase } from 'src/application/usecases/church-service-record/update-church-service-record.usecase';
import { ChurchServiceRecordRepository } from 'src/domain/repositories/church-service-record.repository';
import { PrismaChurchServiceRecordRepository } from 'src/infra/repositories/prisma-church-service-record.repository';
import { CreateChurchServiceRecordController } from 'src/presentation/controllers/church-service-record/create-church-service-record.controller';
import { DeleteChurchServiceRecordController } from 'src/presentation/controllers/church-service-record/delete-church-service-record.controller';
import { GetAllChurchServiceRecordsController } from 'src/presentation/controllers/church-service-record/get-all-church-service-records.controller';
import { GetChurchServiceRecordByIdController } from 'src/presentation/controllers/church-service-record/get-church-service-record-by-id.controller';
import { GetLatestChurchServiceRecordController } from 'src/presentation/controllers/church-service-record/get-latest-church-service-record.controller';
import { UpdateChurchServiceRecordController } from 'src/presentation/controllers/church-service-record/update-church-service-record.controller';

@Module({
  providers: [
    CreateChurchServiceRecordUsecase,
    GetAllChurchServiceRecordsUsecase,
    GetChurchServiceRecordByIdUsecase,
    GetLatestChurchServiceRecordUsecase,
    UpdateChurchServiceRecordUsecase,
    DeleteChurchServiceRecordUsecase,
    PrismaChurchServiceRecordRepository,
    {
      provide: ChurchServiceRecordRepository,
      useExisting: PrismaChurchServiceRecordRepository,
    },
  ],
  controllers: [
    CreateChurchServiceRecordController,
    GetAllChurchServiceRecordsController,
    GetLatestChurchServiceRecordController,
    GetChurchServiceRecordByIdController,
    UpdateChurchServiceRecordController,
    DeleteChurchServiceRecordController,
  ],
})
export class ChurchServiceRecordModule {}
