import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/domain/repositories/user.repository';

@Injectable()
export class DeleteUserUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, churchId: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (user.churchId !== churchId) throw new ForbiddenException();
    return this.userRepository.delete(id);
  }
}
