import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  IUserResponse,
  UpdateUserInput,
  UserRepository,
} from 'src/domain/repositories/user.repository';

@Injectable()
export class UpdateUserUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    id: string,
    input: UpdateUserInput,
    churchId: string,
  ): Promise<IUserResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    if (user.churchId !== churchId) throw new ForbiddenException();

    if (input.email) {
      const existing = await this.userRepository.findByEmail(input.email);
      if (existing && existing.id !== id) {
        throw new ConflictException('Email already in use');
      }
    }

    const data: UpdateUserInput = { ...input };

    if (input.password) {
      data.password = await bcrypt.hash(input.password, 10);
    }

    return this.userRepository.update(id, data);
  }
}
