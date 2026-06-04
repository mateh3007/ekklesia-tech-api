import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ChurchRepository } from 'src/domain/repositories/church.repository';
import { Role } from 'src/domain/enums/role.enum';
import { UserRepository } from 'src/domain/repositories/user.repository';

export interface IRegisterUsecaseInput {
  corporateName: string;
  cnpj: string;
  phone: string;
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class RegisterUsecase {
  constructor(
    private readonly churchRepository: ChurchRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: IRegisterUsecaseInput): Promise<void> {
    const churchAlreadyExists = await this.churchRepository.findByCnpj(
      input.cnpj,
    );
    if (churchAlreadyExists) {
      throw new BadRequestException('Church already exists');
    }

    const church = await this.churchRepository.create({
      corporateName: input.corporateName,
      cnpj: input.cnpj,
      phone: input.phone,
      email: input.email,
    });

    const hashedPassword = await bcrypt.hash(input.password, 10);

    await this.userRepository.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      phone: input.phone,
      role: Role.ADMIN,
      churchId: church.id,
    });
  }
}
