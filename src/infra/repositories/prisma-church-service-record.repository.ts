import { Injectable } from '@nestjs/common';
import { IChurchServiceRecord } from 'src/domain/entities/church-service-record.entity';
import {
  ChurchServiceRecordRepository,
  CreateChurchServiceRecordInput,
  UpdateChurchServiceRecordInput,
} from 'src/domain/repositories/church-service-record.repository';
import { PrismaService } from 'src/infra/config/prisma/prisma.service';

@Injectable()
export class PrismaChurchServiceRecordRepository extends ChurchServiceRecordRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: CreateChurchServiceRecordInput): Promise<IChurchServiceRecord> {
    return this.prisma.churchServiceRecord.create({ data }) as Promise<IChurchServiceRecord>;
  }

  async findAllByChurchId(churchId: string): Promise<IChurchServiceRecord[]> {
    return this.prisma.churchServiceRecord.findMany({
      where: { churchId, deletedAt: null },
      orderBy: { date: 'desc' },
    }) as Promise<IChurchServiceRecord[]>;
  }

  async findById(id: string): Promise<IChurchServiceRecord | null> {
    return this.prisma.churchServiceRecord.findFirst({
      where: { id, deletedAt: null },
    }) as Promise<IChurchServiceRecord | null>;
  }

  async findLatestByChurchId(churchId: string): Promise<IChurchServiceRecord | null> {
    return this.prisma.churchServiceRecord.findFirst({
      where: { churchId, deletedAt: null },
      orderBy: { date: 'desc' },
    }) as Promise<IChurchServiceRecord | null>;
  }

  async update(id: string, data: UpdateChurchServiceRecordInput): Promise<IChurchServiceRecord> {
    return this.prisma.churchServiceRecord.update({
      where: { id },
      data,
    }) as Promise<IChurchServiceRecord>;
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.churchServiceRecord.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
