import { Injectable } from '@nestjs/common';
import { IChurchProfile } from 'src/domain/entities/church-profile.entity';
import {
  ChurchProfileRepository,
  CreateChurchProfileInput,
  UpdateChurchProfileInput,
} from 'src/domain/repositories/church-profile.repository';
import { PrismaService } from 'src/infra/config/prisma/prisma.service';

@Injectable()
export class PrismaChurchProfileRepository extends ChurchProfileRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: CreateChurchProfileInput): Promise<IChurchProfile> {
    return this.prisma.churchProfile.upsert({
      where: { churchId: data.churchId },
      create: data,
      update: { ...data, deletedAt: null },
    }) as Promise<IChurchProfile>;
  }

  async findByChurchId(churchId: string): Promise<IChurchProfile | null> {
    return this.prisma.churchProfile.findFirst({
      where: { churchId, deletedAt: null },
    }) as Promise<IChurchProfile | null>;
  }

  async findByChurchIdIncludingDeleted(churchId: string): Promise<IChurchProfile | null> {
    return this.prisma.churchProfile.findUnique({
      where: { churchId },
    }) as Promise<IChurchProfile | null>;
  }

  async update(churchId: string, data: UpdateChurchProfileInput): Promise<IChurchProfile> {
    return this.prisma.churchProfile.update({
      where: { churchId },
      data,
    }) as Promise<IChurchProfile>;
  }

  async softDelete(churchId: string): Promise<void> {
    await this.prisma.churchProfile.update({
      where: { churchId },
      data: { deletedAt: new Date() },
    });
  }
}
