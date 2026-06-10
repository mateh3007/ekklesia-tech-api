import { Injectable } from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { IPrayerRequest } from 'src/domain/entities/prayer-request.entity';
import {
  CreatePrayerRequestInput,
  PrayerRequestRepository,
} from 'src/domain/repositories/prayer-request.repository';
import { CacheKeys } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class CreatePrayerRequestUsecase {
  constructor(
    private readonly prayerRequestRepository: PrayerRequestRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(input: CreatePrayerRequestInput): Promise<IPrayerRequest> {
    const prayerRequest = await this.prayerRequestRepository.create(input);
    await this.cache.deleteByPattern(CacheKeys.prayerRequestsPattern(input.churchId));
    return prayerRequest;
  }
}
