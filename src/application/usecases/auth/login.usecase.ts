import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/domain/repositories/user.repository';

export interface ILoginInput {
  email: string;
  password: string;
}

export interface ILoginResponse {
  accessToken: string;
}

@Injectable()
export class LoginUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: ILoginInput): Promise<ILoginResponse> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await bcrypt.compare(input.password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      churchId: user.churchId,
    };

    return { accessToken: this.jwtService.sign(payload) };
  }
}
