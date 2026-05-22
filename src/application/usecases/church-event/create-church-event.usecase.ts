import { Injectable } from '@nestjs/common';
import { IChurchEvent } from 'src/domain/entities/church-event.entity';
import { ChurchEventRepository, CreateChurchEventInput } from 'src/domain/repositories/church-event.repository';

@Injectable()
export class CreateChurchEventUsecase {
  constructor(private readonly churchEventRepository: ChurchEventRepository) {}

  async execute(input: CreateChurchEventInput): Promise<IChurchEvent> {
    return this.churchEventRepository.create(input);
  }
}
