import { Injectable, NotFoundException } from '@nestjs/common';
import { IChurchEvent } from 'src/domain/entities/church-event.entity';
import {
  ChurchEventRepository,
  CreateChurchEventInput,
  UpdateChurchEventInput,
} from 'src/domain/repositories/church-event.repository';
import { PrismaService } from 'src/infra/config/prisma/prisma.service';

@Injectable()
export class PrismaChurchEventRepository extends ChurchEventRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: CreateChurchEventInput): Promise<IChurchEvent> {
    return this.prisma.churchEvent.create({ data }) as Promise<IChurchEvent>;
  }

  async findAll(churchId: string): Promise<IChurchEvent[]> {
    return this.prisma.churchEvent.findMany({
      where: { churchId },
      orderBy: { date: 'asc' },
    }) as Promise<IChurchEvent[]>;
  }

  async findById(id: string): Promise<IChurchEvent | null> {
    const event = await this.prisma.churchEvent.findUnique({ where: { id } });
    if (!event) return null;
    return event as IChurchEvent;
  }

  async update(id: string, data: UpdateChurchEventInput): Promise<IChurchEvent> {
    return this.prisma.churchEvent.update({ where: { id }, data }) as Promise<IChurchEvent>;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.churchEvent.delete({ where: { id } });
  }
}
