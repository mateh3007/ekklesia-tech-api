import { Injectable, NotFoundException } from '@nestjs/common';
import { ChurchProfileRepository } from 'src/domain/repositories/church-profile.repository';

@Injectable()
export class DeleteChurchProfileUsecase {
  constructor(private readonly churchProfileRepository: ChurchProfileRepository) {}

  async execute(churchId: string): Promise<void> {
    const profile = await this.churchProfileRepository.findByChurchId(churchId);
    if (!profile) throw new NotFoundException('Church profile not found');
    await this.churchProfileRepository.softDelete(churchId);
  }
}
