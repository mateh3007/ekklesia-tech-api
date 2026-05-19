import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/domain/enums/role.enum';
import { CreateUserInput, IUserResponse, UserRepository } from 'src/domain/repositories/user.repository';

@Injectable()
export class CreateUserUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: CreateUserInput): Promise<IUserResponse> {
    if (input.role === Role.ADMIN) {
      throw new BadRequestException('Cannot create admin users through this endpoint');
    }

    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    return this.userRepository.create({ ...input, password: hashedPassword });
  }
}
