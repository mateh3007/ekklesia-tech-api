import { Injectable } from '@nestjs/common';
import { IPrayerRequest } from 'src/domain/entities/prayer-request.entity';
import { CreatePrayerRequestInput, PrayerRequestRepository } from 'src/domain/repositories/prayer-request.repository';

@Injectable()
export class CreatePrayerRequestUsecase {
  constructor(private readonly prayerRequestRepository: PrayerRequestRepository) {}

  async execute(input: CreatePrayerRequestInput): Promise<IPrayerRequest> {
    return this.prayerRequestRepository.create(input);
  }
}
