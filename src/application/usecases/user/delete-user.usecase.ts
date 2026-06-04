import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from 'src/domain/repositories/user.repository';

@Injectable()
export class DeleteUserUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, churchId: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    if (user.churchId !== churchId) throw new ForbiddenException();
    return this.userRepository.delete(id);
  }
}
