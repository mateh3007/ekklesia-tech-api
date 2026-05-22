import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { IChurchService } from 'src/domain/entities/church-service.entity';
import { ChurchServiceRepository } from 'src/domain/repositories/church-service.repository';

@Injectable()
export class GetChurchServiceByIdUsecase {
  constructor(private readonly churchServiceRepository: ChurchServiceRepository) {}

  async execute(id: string, churchId: string): Promise<IChurchService> {
    const service = await this.churchServiceRepository.findById(id);
    if (service && service.churchId !== churchId) throw new ForbiddenException();
    if (!service) throw new NotFoundException('Church service not found');
    return service;
  }
}
