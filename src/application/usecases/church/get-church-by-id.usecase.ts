import { Injectable, NotFoundException } from '@nestjs/common';
import { IChurch } from 'src/domain/entities/church.entity';
import { ChurchRepository } from 'src/domain/repositories/church.repository';

@Injectable()
export class GetChurchByIdUsecase {
  constructor(private readonly churchRepository: ChurchRepository) {}

  async execute(id: string): Promise<IChurch> {
    const church = await this.churchRepository.findById(id);
    if (!church) throw new NotFoundException('Church not found');
    return church;
  }
}
