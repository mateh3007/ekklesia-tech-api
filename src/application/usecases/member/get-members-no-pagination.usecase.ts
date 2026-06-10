import { Injectable } from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { Role } from 'src/domain/enums/role.enum';
import { MemberRepository } from 'src/domain/repositories/member.repository';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { IdName } from 'src/domain/types/id-name.type';
import { CacheKeys, CacheTTL } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class GetMembersNoPaginationUsecase {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly userRepository: UserRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(churchId: string): Promise<IdName[]> {
    const cacheKey = CacheKeys.membersNoPagination(churchId);
    const cached = await this.cache.get<IdName[]>(cacheKey);
    if (cached) return cached;

    const [members, adminUsers] = await Promise.all([
      this.memberRepository.findByChurchId(churchId),
      this.userRepository.findByChurchIdAndRoles(churchId, [
        Role.ADMIN,
        Role.SUPERVISOR,
      ]),
    ]);

    const result: IdName[] = [
      ...members.map((m) => ({ id: m.id, name: m.name })),
      ...adminUsers.map((u) => ({ id: u.id, name: u.name })),
    ];

    await this.cache.set(cacheKey, result, CacheTTL.MEMBERS);
    return result;
  }
}
