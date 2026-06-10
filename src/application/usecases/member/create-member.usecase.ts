import { Injectable } from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { IMember } from 'src/domain/entities/member.entity';
import { MemberRepository } from 'src/domain/repositories/member.repository';
import { CacheKeys } from 'src/infra/adapters/cache-key.util';

type CreateMemberBody = {
  name: string;
  phone?: string;
  dateOfBirth: Date;
};

@Injectable()
export class CreateMemberUsecase {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(input: CreateMemberBody, churchId: string): Promise<IMember> {
    const member = await this.memberRepository.create({ ...input, churchId });
    await Promise.all([
      this.cache.deleteByPattern(CacheKeys.membersPattern(churchId)),
      this.cache.deleteByPattern(CacheKeys.agendaPattern(churchId)),
    ]);
    return member;
  }
}
