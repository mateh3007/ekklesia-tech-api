import { Injectable, NotFoundException } from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { ChurchProfileRepository } from 'src/domain/repositories/church-profile.repository';
import { CacheKeys } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class DeleteChurchProfileUsecase {
  constructor(
    private readonly churchProfileRepository: ChurchProfileRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(churchId: string): Promise<void> {
    const profile = await this.churchProfileRepository.findByChurchId(churchId);
    if (!profile) throw new NotFoundException('Church profile not found');
    await this.churchProfileRepository.softDelete(churchId);
    await this.cache.delete(CacheKeys.churchProfile(churchId));
  }
}
