import { Module } from '@nestjs/common';
import { GetChurchByIdUsecase } from 'src/application/usecases/church/get-church-by-id.usecase';
import { GetMyChurchUsecase } from 'src/application/usecases/church/get-my-church.usecase';
import { ChurchRepository } from 'src/domain/repositories/church.repository';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { PrismaChurchRepository } from 'src/infra/repositories/prisma-church.repository';
import { PrismaUserRepository } from 'src/infra/repositories/prisma-user.repository';
import { GetChurchByIdController } from 'src/presentation/controllers/church/get-church-by-id.controller';
import { GetMyChurchController } from 'src/presentation/controllers/church/get-my-church.controller';

@Module({
  providers: [
    GetChurchByIdUsecase,
    GetMyChurchUsecase,
    PrismaChurchRepository,
    {
      provide: ChurchRepository,
      useExisting: PrismaChurchRepository,
    },
    PrismaUserRepository,
    {
      provide: UserRepository,
      useExisting: PrismaUserRepository,
    },
  ],
  controllers: [GetMyChurchController, GetChurchByIdController],
})
export class ChurchModule {}

