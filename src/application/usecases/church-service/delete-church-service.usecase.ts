import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ChurchServiceRepository } from 'src/domain/repositories/church-service.repository';

@Injectable()
export class DeleteChurchServiceUsecase {
  constructor(private readonly churchServiceRepository: ChurchServiceRepository) {}

  async execute(id: string, churchId: string): Promise<void> {
    const service = await this.churchServiceRepository.findById(id);
    if (service && service.churchId !== churchId) throw new ForbiddenException();
    if (!service) throw new NotFoundException();
    return this.churchServiceRepository.delete(id);
  }
}
