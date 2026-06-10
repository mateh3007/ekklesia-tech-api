import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { IChurchProfile } from 'src/domain/entities/church-profile.entity';
import {
  ChurchProfileRepository,
  UpdateChurchProfileInput,
} from 'src/domain/repositories/church-profile.repository';
import { CacheKeys } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class UpdateChurchProfileUsecase {
  constructor(
    private readonly churchProfileRepository: ChurchProfileRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(
    churchId: string,
    data: UpdateChurchProfileInput,
  ): Promise<IChurchProfile> {
    if (data.pixKeyType && !data.pixKey)
      throw new BadRequestException(
        'pixKey is required when changing pixKeyType',
      );

    const profile = await this.churchProfileRepository.findByChurchId(churchId);
    if (!profile) throw new NotFoundException('Church profile not found');

    const updated = await this.churchProfileRepository.update(churchId, data);
    await this.cache.delete(CacheKeys.churchProfile(churchId));
    return updated;
  }
}
