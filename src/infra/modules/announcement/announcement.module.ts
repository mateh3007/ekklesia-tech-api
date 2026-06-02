import { Module } from '@nestjs/common';
import { CreateAnnouncementUsecase } from 'src/application/usecases/announcement/create-announcement.usecase';
import { DeleteAnnouncementUsecase } from 'src/application/usecases/announcement/delete-announcement.usecase';
import { GetAllAnnouncementsUsecase } from 'src/application/usecases/announcement/get-all-announcements.usecase';
import { GetAnnouncementByIdUsecase } from 'src/application/usecases/announcement/get-announcement-by-id.usecase';
import { UpdateAnnouncementUsecase } from 'src/application/usecases/announcement/update-announcement.usecase';
import { AnnouncementRepository } from 'src/domain/repositories/announcement.repository';
import { PrismaAnnouncementRepository } from 'src/infra/repositories/prisma-announcement.repository';
import { CreateAnnouncementController } from 'src/presentation/controllers/announcement/create-announcement.controller';
import { DeleteAnnouncementController } from 'src/presentation/controllers/announcement/delete-announcement.controller';
import { GetAllAnnouncementsController } from 'src/presentation/controllers/announcement/get-all-announcements.controller';
import { GetAnnouncementByIdController } from 'src/presentation/controllers/announcement/get-announcement-by-id.controller';
import { UpdateAnnouncementController } from 'src/presentation/controllers/announcement/update-announcement.controller';

@Module({
  providers: [
    CreateAnnouncementUsecase,
    GetAllAnnouncementsUsecase,
    GetAnnouncementByIdUsecase,
    UpdateAnnouncementUsecase,
    DeleteAnnouncementUsecase,
    PrismaAnnouncementRepository,
    {
      provide: AnnouncementRepository,
      useExisting: PrismaAnnouncementRepository,
    },
  ],
  controllers: [
    CreateAnnouncementController,
    GetAllAnnouncementsController,
    GetAnnouncementByIdController,
    UpdateAnnouncementController,
    DeleteAnnouncementController,
  ],
})
export class AnnouncementModule {}
