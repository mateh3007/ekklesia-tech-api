import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ChurchEventRepository } from 'src/domain/repositories/church-event.repository';

@Injectable()
export class DeleteChurchEventUsecase {
  constructor(private readonly churchEventRepository: ChurchEventRepository) {}

  async execute(id: string, churchId: string): Promise<void> {
    const event = await this.churchEventRepository.findById(id);
    if (!event) throw new NotFoundException('Church event not found');
    if (event.churchId !== churchId) throw new ForbiddenException();
    return this.churchEventRepository.delete(id);
  }
}
