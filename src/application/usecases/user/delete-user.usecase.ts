import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/domain/repositories/user.repository';

@Injectable()
export class DeleteUserUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<void> {
    await this.userRepository.findById(id);
    return this.userRepository.delete(id);
  }
}
