import { Module } from '@nestjs/common';
import { RegisterUsecase } from 'src/application/usecases/register/register.usecase';
import { ChurchRepository } from 'src/domain/repositories/church.repository';
import { PrismaChurchRepository } from 'src/infra/repositories/prisma-church.repository';
import { RegisterController } from 'src/presentation/controllers/register/register.controller';

@Module({
  providers: [
    RegisterUsecase,
    PrismaChurchRepository,
    {
      provide: ChurchRepository,
      useClass: PrismaChurchRepository,
    },
  ],
  controllers: [RegisterController],
})
export class RegisterModule {}