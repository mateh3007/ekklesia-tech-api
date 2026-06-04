import { ConflictException, Injectable } from '@nestjs/common';
import { IChurchProfile } from 'src/domain/entities/church-profile.entity';
import {
  ChurchProfileRepository,
  CreateChurchProfileInput,
} from 'src/domain/repositories/church-profile.repository';

@Injectable()
export class CreateChurchProfileUsecase {
  constructor(
    private readonly churchProfileRepository: ChurchProfileRepository,
  ) {}

  async execute(input: CreateChurchProfileInput): Promise<IChurchProfile> {
    const existing =
      await this.churchProfileRepository.findByChurchIdIncludingDeleted(
        input.churchId,
      );
    if (existing && !existing.deletedAt)
      throw new ConflictException('Church profile already exists');
    return this.churchProfileRepository.create(input);
  }
}
