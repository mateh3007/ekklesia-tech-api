import { Injectable } from '@nestjs/common';
import { IChurchService } from 'src/domain/entities/church-service.entity';
import { ChurchServiceRepository, CreateChurchServiceInput } from 'src/domain/repositories/church-service.repository';

@Injectable()
export class CreateChurchServiceUsecase {
  constructor(private readonly churchServiceRepository: ChurchServiceRepository) {}

  async execute(input: CreateChurchServiceInput): Promise<IChurchService> {
    return this.churchServiceRepository.create(input);
  }
}
