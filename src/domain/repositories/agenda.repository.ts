import type { IAgenda } from 'src/application/usecases/agenda/get-agenda.usecase';

export abstract class AgendaRepository {
  abstract getAgenda(
    churchId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<IAgenda>;
}
