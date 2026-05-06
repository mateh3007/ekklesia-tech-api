import { Module } from '@nestjs/common';
import { GetChurchByIdUsecase } from 'src/application/usecases/church/get-church-by-id.usecase';
import { ChurchRepository } from 'src/domain/repositories/church.repository';
import { PrismaChurchRepository } from 'src/infra/repositories/prisma-church.repository';
import { GetChurchByIdController } from 'src/presentation/controllers/church/get-church-by-id.controller';

@Module({
  providers: [
    GetChurchByIdUsecase,
    PrismaChurchRepository,
    {
      provide: ChurchRepository,
      useExisting: PrismaChurchRepository,
    },
  ],
  controllers: [GetChurchByIdController],
})
export class ChurchModule {}

