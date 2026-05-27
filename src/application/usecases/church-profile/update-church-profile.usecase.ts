import { Injectable, NotFoundException } from '@nestjs/common';
import { IChurchProfile } from 'src/domain/entities/church-profile.entity';
import { ChurchProfileRepository, UpdateChurchProfileInput } from 'src/domain/repositories/church-profile.repository';

@Injectable()
export class UpdateChurchProfileUsecase {
  constructor(private readonly churchProfileRepository: ChurchProfileRepository) {}

  async execute(churchId: string, data: UpdateChurchProfileInput): Promise<IChurchProfile> {
    const profile = await this.churchProfileRepository.findByChurchId(churchId);
    if (!profile) throw new NotFoundException('Church profile not found');
    return this.churchProfileRepository.update(churchId, data);
  }
}
