import { ConflictException, Injectable } from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { IChurchProfile } from 'src/domain/entities/church-profile.entity';
import {
  ChurchProfileRepository,
  CreateChurchProfileInput,
} from 'src/domain/repositories/church-profile.repository';
import { CacheKeys } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class CreateChurchProfileUsecase {
  constructor(
    private readonly churchProfileRepository: ChurchProfileRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(input: CreateChurchProfileInput): Promise<IChurchProfile> {
    const existing =
      await this.churchProfileRepository.findByChurchIdIncludingDeleted(
        input.churchId,
      );
    if (existing && !existing.deletedAt)
      throw new ConflictException('Church profile already exists');

    const profile = await this.churchProfileRepository.create(input);
    await this.cache.delete(CacheKeys.churchProfile(input.churchId));
    return profile;
  }
}
