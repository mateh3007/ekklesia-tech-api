import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUserResponse, UpdateUserInput, UserRepository } from 'src/domain/repositories/user.repository';

@Injectable()
export class UpdateUserUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, input: UpdateUserInput): Promise<IUserResponse> {
    await this.userRepository.findById(id);

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
