import { Injectable } from '@nestjs/common';
import { IChurchService } from 'src/domain/entities/church-service.entity';
import { ChurchServiceRepository } from 'src/domain/repositories/church-service.repository';

@Injectable()
export class GetAllChurchServicesUsecase {
  constructor(
    private readonly churchServiceRepository: ChurchServiceRepository,
  ) {}

  async execute(churchId: string): Promise<IChurchService[]> {
    return this.churchServiceRepository.findAll(churchId);
  }
}
