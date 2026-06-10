import { Injectable } from '@nestjs/common';
import { IChurchEvent } from 'src/domain/entities/church-event.entity';
import {
  ChurchEventRepository,
  CreateChurchEventInput,
  UpdateChurchEventInput,
} from 'src/domain/repositories/church-event.repository';
import { PaginatedResult } from 'src/domain/types/paginated-result.type';
import { PrismaService } from 'src/infra/config/prisma/prisma.service';

@Injectable()
export class PrismaChurchEventRepository extends ChurchEventRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: CreateChurchEventInput): Promise<IChurchEvent> {
    return this.prisma.churchEvent.create({ data });
  }

  async findAll(churchId: string): Promise<IChurchEvent[]> {
    return this.prisma.churchEvent.findMany({
      where: { churchId },
      orderBy: { date: 'asc' },
    });
  }

  async findPaginated(
    churchId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<IChurchEvent>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.churchEvent.findMany({
        where: { churchId },
        orderBy: { date: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.churchEvent.count({ where: { churchId } }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string): Promise<IChurchEvent | null> {
    const event = await this.prisma.churchEvent.findUnique({ where: { id } });
    if (!event) return null;
    return event;
  }

  async update(
    id: string,
    data: UpdateChurchEventInput,
  ): Promise<IChurchEvent> {
    return this.prisma.churchEvent.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.churchEvent.delete({ where: { id } });
  }
}
