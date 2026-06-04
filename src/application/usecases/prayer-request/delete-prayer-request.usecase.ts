import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrayerRequestRepository } from 'src/domain/repositories/prayer-request.repository';

@Injectable()
export class DeletePrayerRequestUsecase {
  constructor(
    private readonly prayerRequestRepository: PrayerRequestRepository,
  ) {}

  async execute(id: string, churchId: string): Promise<void> {
    const prayerRequest = await this.prayerRequestRepository.findById(id);
    if (!prayerRequest) throw new NotFoundException('Prayer request not found');
    if (prayerRequest.churchId !== churchId)
      throw new ForbiddenException('Access denied to this prayer request');
    await this.prayerRequestRepository.softDelete(id);
  }
}
