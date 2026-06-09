import { Injectable } from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { IMember } from 'src/domain/entities/member.entity';
import { MemberRepository } from 'src/domain/repositories/member.repository';
import { CacheKeys, CacheTTL } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class GetAllMembersUsecase {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(churchId: string): Promise<IMember[]> {
    const cacheKey = CacheKeys.members(churchId);
    const cached = await this.cache.get<IMember[]>(cacheKey);
    if (cached) return cached;

    const members = await this.memberRepository.findByChurchId(churchId);
    await this.cache.set(cacheKey, members, CacheTTL.MEMBERS);
    return members;
  }
}
