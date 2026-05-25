import { Module } from '@nestjs/common';
import { GetAgendaUsecase } from 'src/application/usecases/agenda/get-agenda.usecase';
import { AgendaRepository } from 'src/domain/repositories/agenda.repository';
import { PrismaAgendaRepository } from 'src/infra/repositories/prisma-agenda.repository';
import { GetAgendaController } from 'src/presentation/controllers/agenda/get-agenda.controller';

@Module({
  providers: [
    GetAgendaUsecase,
    PrismaAgendaRepository,
    { provide: AgendaRepository, useExisting: PrismaAgendaRepository },
  ],
  controllers: [GetAgendaController],
})
export class AgendaModule {}
