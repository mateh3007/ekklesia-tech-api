import { Injectable } from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { IMember } from 'src/domain/entities/member.entity';
import { Role } from 'src/domain/enums/role.enum';
import { MemberRepository } from 'src/domain/repositories/member.repository';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { PaginatedResult } from 'src/domain/types/paginated-result.type';
import { CacheKeys, CacheTTL } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class GetAllMembersUsecase {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly userRepository: UserRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(
    churchId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<IMember>> {
    const cacheKey = CacheKeys.members(churchId, page, limit);
    const cached = await this.cache.get<PaginatedResult<IMember>>(cacheKey);
    if (cached) return cached;

    const [members, adminUsers] = await Promise.all([
      this.memberRepository.findByChurchId(churchId),
      this.userRepository.findByChurchIdAndRoles(churchId, [
        Role.ADMIN,
        Role.SUPERVISOR,
      ]),
    ]);

    const usersAsMembers: IMember[] = adminUsers.map((u) => ({
      id: u.id,
      churchId: u.churchId,
      name: u.name,
      phone: u.phone,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));

    const combined = [...members, ...usersAsMembers];
    const total = combined.length;
    const skip = (page - 1) * limit;
    const data = combined.slice(skip, skip + limit);

    const result: PaginatedResult<IMember> = {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
    await this.cache.set(cacheKey, result, CacheTTL.MEMBERS);
    return result;
  }
}
