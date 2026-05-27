import { Module } from '@nestjs/common';
import { CreateChurchProfileUsecase } from 'src/application/usecases/church-profile/create-church-profile.usecase';
import { DeleteChurchProfileUsecase } from 'src/application/usecases/church-profile/delete-church-profile.usecase';
import { GetChurchProfileUsecase } from 'src/application/usecases/church-profile/get-church-profile.usecase';
import { UpdateChurchProfileUsecase } from 'src/application/usecases/church-profile/update-church-profile.usecase';
import { ChurchProfileRepository } from 'src/domain/repositories/church-profile.repository';
import { PrismaChurchProfileRepository } from 'src/infra/repositories/prisma-church-profile.repository';
import { CreateChurchProfileController } from 'src/presentation/controllers/church-profile/create-church-profile.controller';
import { DeleteChurchProfileController } from 'src/presentation/controllers/church-profile/delete-church-profile.controller';
import { GetChurchProfileController } from 'src/presentation/controllers/church-profile/get-church-profile.controller';
import { UpdateChurchProfileController } from 'src/presentation/controllers/church-profile/update-church-profile.controller';

@Module({
  providers: [
    CreateChurchProfileUsecase,
    GetChurchProfileUsecase,
    UpdateChurchProfileUsecase,
    DeleteChurchProfileUsecase,
    PrismaChurchProfileRepository,
    {
      provide: ChurchProfileRepository,
      useExisting: PrismaChurchProfileRepository,
    },
  ],
  controllers: [CreateChurchProfileController, GetChurchProfileController, UpdateChurchProfileController, DeleteChurchProfileController],
  exports: [CreateChurchProfileUsecase],
})
export class ChurchProfileModule {}
