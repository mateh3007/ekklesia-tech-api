import { Injectable, NotFoundException } from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import {
  IUserResponse,
  UserRepository,
} from 'src/domain/repositories/user.repository';
import { CacheKeys, CacheTTL } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class GetMeUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(userId: string): Promise<IUserResponse> {
    const cacheKey = CacheKeys.userById(userId);
    const cached = await this.cache.get<IUserResponse>(cacheKey);
    if (cached) return cached;

    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    await this.cache.set(cacheKey, user, CacheTTL.USER);
    return user;
  }
}
