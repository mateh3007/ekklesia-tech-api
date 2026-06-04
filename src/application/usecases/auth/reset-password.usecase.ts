import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { PasswordResetTokenRepository } from 'src/domain/repositories/password-reset-token.repository';

export interface IResetPasswordInput {
  token: string;
  newPassword: string;
}

@Injectable()
export class ResetPasswordUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordResetTokenRepository: PasswordResetTokenRepository,
  ) {}

  async execute(input: IResetPasswordInput): Promise<void> {
    const resetToken = await this.passwordResetTokenRepository.findByToken(
      input.token,
    );
    if (!resetToken) throw new BadRequestException('Invalid or expired token');
    if (resetToken.usedAt)
      throw new BadRequestException('Token has already been used');
    if (resetToken.expiresAt < new Date())
      throw new BadRequestException('Token has expired');

    const hashedPassword = await bcrypt.hash(input.newPassword, 10);
    await this.userRepository.updatePassword(resetToken.userId, hashedPassword);
    await this.passwordResetTokenRepository.markAsUsed(resetToken.id);
  }
}
