import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import {
  IUserResponse,
  UserRepository,
} from 'src/domain/repositories/user.repository';
import { CacheKeys, CacheTTL } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class GetUserByIdUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(id: string, churchId: string): Promise<IUserResponse> {
    const cacheKey = CacheKeys.userById(id);
    const cached = await this.cache.get<IUserResponse>(cacheKey);
    if (cached) {
      if (cached.churchId !== churchId) throw new ForbiddenException();
      return cached;
    }

    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    if (user.churchId !== churchId) throw new ForbiddenException();

    await this.cache.set(cacheKey, user, CacheTTL.USER);
    return user;
  }
}
