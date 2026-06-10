import { Injectable } from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { PaginatedResult } from 'src/domain/types/paginated-result.type';
import {
  IUserResponse,
  UserRepository,
} from 'src/domain/repositories/user.repository';
import { CacheKeys, CacheTTL } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class GetAllUsersUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(
    churchId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<IUserResponse>> {
    const cacheKey = CacheKeys.users(churchId, page, limit);
    const cached = await this.cache.get<PaginatedResult<IUserResponse>>(cacheKey);
    if (cached) return cached;

    const result = await this.userRepository.findByChurchIdPaginated(churchId, page, limit);
    await this.cache.set(cacheKey, result, CacheTTL.USERS);
    return result;
  }
}
