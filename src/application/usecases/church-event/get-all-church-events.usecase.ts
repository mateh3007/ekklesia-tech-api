import { Injectable } from '@nestjs/common';
import { IChurchEvent } from 'src/domain/entities/church-event.entity';
import { ChurchEventRepository } from 'src/domain/repositories/church-event.repository';

@Injectable()
export class GetAllChurchEventsUsecase {
  constructor(private readonly churchEventRepository: ChurchEventRepository) {}

  async execute(churchId: string): Promise<IChurchEvent[]> {
    return this.churchEventRepository.findAll(churchId);
  }
}
