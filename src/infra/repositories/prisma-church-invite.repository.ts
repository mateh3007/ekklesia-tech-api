import { Injectable, NotFoundException } from '@nestjs/common';
import { InviteStatus } from '@prisma/client';
import type { IChurchInvite } from 'src/application/usecases/invite/create-invite.usecase';
import {
  ChurchInviteRepository,
  CreateChurchInviteInput,
} from 'src/domain/repositories/church-invite.repository';
import { PrismaService } from 'src/infra/config/prisma/prisma.service';

@Injectable()
export class PrismaChurchInviteRepository extends ChurchInviteRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: CreateChurchInviteInput): Promise<IChurchInvite> {
    return this.prisma.churchInvite.create({ data });
  }

  async findAll(): Promise<IChurchInvite[]> {
    return this.prisma.churchInvite.findMany();
  }

  async findById(id: string): Promise<IChurchInvite> {
    const invite = await this.prisma.churchInvite.findUnique({ where: { id } });
    if (!invite) throw new NotFoundException(`ChurchInvite ${id} not found`);
    return invite;
  }

  async update(id: string, _data: never): Promise<IChurchInvite> {
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.churchInvite.delete({ where: { id } });
  }

  async findByToken(token: string): Promise<IChurchInvite | null> {
    return this.prisma.churchInvite.findUnique({
      where: { token },
    });
  }

  async findPendingByEmailAndChurch(
    email: string,
    churchId: string,
  ): Promise<IChurchInvite | null> {
    return this.prisma.churchInvite.findFirst({
      where: { email, churchId, status: InviteStatus.PENDING },
    });
  }

  async updateStatus(id: string, status: InviteStatus): Promise<void> {
    await this.prisma.churchInvite.update({ where: { id }, data: { status } });
  }
}
