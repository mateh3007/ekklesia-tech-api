import { Module } from '@nestjs/common';
import { CreateChurchEventUsecase } from 'src/application/usecases/church-event/create-church-event.usecase';
import { DeleteChurchEventUsecase } from 'src/application/usecases/church-event/delete-church-event.usecase';
import { GetAllChurchEventsUsecase } from 'src/application/usecases/church-event/get-all-church-events.usecase';
import { GetChurchEventByIdUsecase } from 'src/application/usecases/church-event/get-church-event-by-id.usecase';
import { UpdateChurchEventUsecase } from 'src/application/usecases/church-event/update-church-event.usecase';
import { ChurchEventRepository } from 'src/domain/repositories/church-event.repository';
import { PrismaChurchEventRepository } from 'src/infra/repositories/prisma-church-event.repository';
import { CreateChurchEventController } from 'src/presentation/controllers/church-event/create-church-event.controller';
import { DeleteChurchEventController } from 'src/presentation/controllers/church-event/delete-church-event.controller';
import { GetAllChurchEventsController } from 'src/presentation/controllers/church-event/get-all-church-events.controller';
import { GetChurchEventByIdController } from 'src/presentation/controllers/church-event/get-church-event-by-id.controller';
import { UpdateChurchEventController } from 'src/presentation/controllers/church-event/update-church-event.controller';

@Module({
  providers: [
    CreateChurchEventUsecase,
    GetAllChurchEventsUsecase,
    GetChurchEventByIdUsecase,
    UpdateChurchEventUsecase,
    DeleteChurchEventUsecase,
    PrismaChurchEventRepository,
    {
      provide: ChurchEventRepository,
      useExisting: PrismaChurchEventRepository,
    },
  ],
  controllers: [
    CreateChurchEventController,
    GetAllChurchEventsController,
    GetChurchEventByIdController,
    UpdateChurchEventController,
    DeleteChurchEventController,
  ],
})
export class ChurchEventModule {}
