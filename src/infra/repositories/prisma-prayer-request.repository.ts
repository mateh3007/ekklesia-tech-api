import { Injectable } from '@nestjs/common';
import { IPrayerRequest } from 'src/domain/entities/prayer-request.entity';
import {
  CreatePrayerRequestInput,
  PrayerRequestRepository,
  UpdatePrayerRequestInput,
} from 'src/domain/repositories/prayer-request.repository';
import { PrismaService } from 'src/infra/config/prisma/prisma.service';

@Injectable()
export class PrismaPrayerRequestRepository extends PrayerRequestRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: CreatePrayerRequestInput): Promise<IPrayerRequest> {
    return this.prisma.prayerRequest.create({
      data,
    }) as Promise<IPrayerRequest>;
  }

  async findAllByChurchId(churchId: string): Promise<IPrayerRequest[]> {
    return this.prisma.prayerRequest.findMany({
      where: { churchId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    }) as Promise<IPrayerRequest[]>;
  }

  async findById(id: string): Promise<IPrayerRequest | null> {
    return this.prisma.prayerRequest.findFirst({
      where: { id, deletedAt: null },
    }) as Promise<IPrayerRequest | null>;
  }

  async update(
    id: string,
    data: UpdatePrayerRequestInput,
  ): Promise<IPrayerRequest> {
    return this.prisma.prayerRequest.update({
      where: { id },
      data,
    }) as Promise<IPrayerRequest>;
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.prayerRequest.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
