import { Injectable } from '@nestjs/common';
import { IPrayerRequest } from 'src/domain/entities/prayer-request.entity';
import { PrayerRequestRepository } from 'src/domain/repositories/prayer-request.repository';

@Injectable()
export class GetAllPrayerRequestsUsecase {
  constructor(
    private readonly prayerRequestRepository: PrayerRequestRepository,
  ) {}

  async execute(churchId: string): Promise<IPrayerRequest[]> {
    return this.prayerRequestRepository.findAllByChurchId(churchId);
  }
}
