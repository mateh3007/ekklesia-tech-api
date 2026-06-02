import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { IPrayerRequest } from 'src/domain/entities/prayer-request.entity';
import { PrayerRequestRepository, UpdatePrayerRequestInput } from 'src/domain/repositories/prayer-request.repository';

@Injectable()
export class UpdatePrayerRequestUsecase {
  constructor(private readonly prayerRequestRepository: PrayerRequestRepository) {}

  async execute(id: string, data: UpdatePrayerRequestInput, churchId: string): Promise<IPrayerRequest> {
    const prayerRequest = await this.prayerRequestRepository.findById(id);
    if (!prayerRequest) throw new NotFoundException('Prayer request not found');
    if (prayerRequest.churchId !== churchId) throw new ForbiddenException('Access denied to this prayer request');
    return this.prayerRequestRepository.update(id, data);
  }
}
