import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/config/prisma/prisma.service';
import { CreateMemberInput, MemberRepository, UpdateMemberInput } from 'src/domain/repositories/member.repository';
import { IMember } from 'src/domain/entities/member.entity';

@Injectable()
export class PrismaMemberRepository extends MemberRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: CreateMemberInput): Promise<IMember> {
    return this.prisma.member.create({ data }) as Promise<IMember>;
  }

  async findAll(): Promise<IMember[]> {
    return this.prisma.member.findMany() as Promise<IMember[]>;
  }

  async findById(id: string): Promise<IMember> {
    const member = await this.prisma.member.findUnique({ where: { id } });
    if (!member) throw new NotFoundException(`Member ${id} not found`);
    return member as IMember;
  }

  async update(id: string, data: UpdateMemberInput): Promise<IMember> {
    return this.prisma.member.update({ where: { id }, data }) as Promise<IMember>;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.member.delete({ where: { id } });
  }

  async findByChurchId(churchId: string): Promise<IMember[]> {
    return this.prisma.member.findMany({ where: { churchId } }) as Promise<IMember[]>;
  }
}
