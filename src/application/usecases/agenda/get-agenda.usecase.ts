import { Injectable } from '@nestjs/common';
import { IChurchEvent } from 'src/domain/entities/church-event.entity';
import { IChurchService } from 'src/domain/entities/church-service.entity';
import { AgendaRepository } from 'src/domain/repositories/agenda.repository';
import { AgendaFilter } from 'src/presentation/dtos/agenda/get-agenda-query.dto';

export interface IBirthday {
  id: string;
  name: string;
  dateOfBirth: Date;
}

export interface IAgenda {
  services: IChurchService[];
  events: IChurchEvent[];
  birthdays: IBirthday[];
}

@Injectable()
export class GetAgendaUsecase {
  constructor(private readonly agendaRepository: AgendaRepository) {}

  async execute(
    churchId: string,
    filter: AgendaFilter,
    date: string,
  ): Promise<IAgenda> {
    const { startDate, endDate } = this.computeDateRange(filter, date);
    return this.agendaRepository.getAgenda(churchId, startDate, endDate);
  }

  private computeDateRange(
    filter: AgendaFilter,
    date: string,
  ): { startDate: Date; endDate: Date } {
    const startDate = new Date(`${date}T00:00:00.000Z`);

    if (filter === AgendaFilter.DAY) {
      const endDate = new Date(`${date}T23:59:59.999Z`);
      return { startDate, endDate };
    }

    if (filter === AgendaFilter.WEEK) {
      const endDate = new Date(startDate);
      endDate.setUTCDate(endDate.getUTCDate() + 6);
      endDate.setUTCHours(23, 59, 59, 999);
      return { startDate, endDate };
    }

    // month
    const [year, month] = date.split('-').map(Number);
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    const firstDay = new Date(Date.UTC(year, month - 1, 1));
    return { startDate: firstDay, endDate };
  }
}
