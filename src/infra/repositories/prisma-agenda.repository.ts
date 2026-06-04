import { Injectable } from '@nestjs/common';
import { Day } from 'src/domain/enums/day.enu';
import type { IAgenda } from 'src/application/usecases/agenda/get-agenda.usecase';
import { AgendaRepository } from 'src/domain/repositories/agenda.repository';
import { PrismaService } from 'src/infra/config/prisma/prisma.service';

const DAY_MAP: Day[] = [
  Day.SUNDAY,
  Day.MONDAY,
  Day.TUESDAY,
  Day.WEDNESDAY,
  Day.THURSDAY,
  Day.FRIDAY,
  Day.SATURDAY,
];

function getDaysInRange(startDate: Date, endDate: Date): Day[] {
  const days = new Set<Day>();
  const current = new Date(startDate);
  while (current <= endDate) {
    days.add(DAY_MAP[current.getUTCDay()]);
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return [...days];
}

function birthdayInRange(dateOfBirth: Date, start: Date, end: Date): boolean {
  const year = start.getUTCFullYear();
  const bday = new Date(
    Date.UTC(year, dateOfBirth.getUTCMonth(), dateOfBirth.getUTCDate()),
  );
  const bdayNext = new Date(
    Date.UTC(year + 1, dateOfBirth.getUTCMonth(), dateOfBirth.getUTCDate()),
  );
  return (
    (bday >= start && bday <= end) || (bdayNext >= start && bdayNext <= end)
  );
}

@Injectable()
export class PrismaAgendaRepository extends AgendaRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async getAgenda(
    churchId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<IAgenda> {
    const daysInRange = getDaysInRange(startDate, endDate);

    const [services, events, members] = await Promise.all([
      this.prisma.churchService.findMany({
        where: { churchId, day: { in: daysInRange } },
        orderBy: { startsAt: 'asc' },
      }),
      this.prisma.churchEvent.findMany({
        where: { churchId, date: { gte: startDate, lte: endDate } },
        orderBy: { date: 'asc' },
      }),
      this.prisma.member.findMany({ where: { churchId } }),
    ]);

    const birthdays = members
      .filter((m) => birthdayInRange(m.dateOfBirth, startDate, endDate))
      .map((m) => ({ id: m.id, name: m.name, dateOfBirth: m.dateOfBirth }));

    return {
      services: services as unknown as IAgenda['services'],
      events: events as unknown as IAgenda['events'],
      birthdays,
    };
  }
}
