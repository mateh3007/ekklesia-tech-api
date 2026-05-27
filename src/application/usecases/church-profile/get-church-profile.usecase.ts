import { Injectable, NotFoundException } from '@nestjs/common';
import { IChurchProfile } from 'src/domain/entities/church-profile.entity';
import { ChurchProfileRepository } from 'src/domain/repositories/church-profile.repository';

@Injectable()
export class GetChurchProfileUsecase {
  constructor(private readonly churchProfileRepository: ChurchProfileRepository) {}

  async execute(churchId: string): Promise<IChurchProfile> {
    const profile = await this.churchProfileRepository.findByChurchId(churchId);
    if (!profile) throw new NotFoundException('Church profile not found');
    return profile;
  }
}
