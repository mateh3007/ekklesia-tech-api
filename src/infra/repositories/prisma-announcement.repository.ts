import { Injectable } from '@nestjs/common';
import { IAnnouncement } from 'src/domain/entities/announcement.entity';
import {
  AnnouncementRepository,
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from 'src/domain/repositories/announcement.repository';
import { PrismaService } from 'src/infra/config/prisma/prisma.service';

@Injectable()
export class PrismaAnnouncementRepository extends AnnouncementRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: CreateAnnouncementInput): Promise<IAnnouncement> {
    return this.prisma.announcement.create({ data }) as Promise<IAnnouncement>;
  }

  async findAllByChurchId(churchId: string): Promise<IAnnouncement[]> {
    return this.prisma.announcement.findMany({
      where: { churchId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    }) as Promise<IAnnouncement[]>;
  }

  async findById(id: string): Promise<IAnnouncement | null> {
    return this.prisma.announcement.findFirst({
      where: { id, deletedAt: null },
    }) as Promise<IAnnouncement | null>;
  }

  async update(id: string, data: UpdateAnnouncementInput): Promise<IAnnouncement> {
    return this.prisma.announcement.update({
      where: { id },
      data,
    }) as Promise<IAnnouncement>;
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.announcement.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
