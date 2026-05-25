import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { PasswordResetTokenRepository } from 'src/domain/repositories/password-reset-token.repository';
import { EmailAdapter } from 'src/application/services/email.adapter';

@Injectable()
export class ForgotPasswordUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordResetTokenRepository: PasswordResetTokenRepository,
    private readonly emailAdapter: EmailAdapter,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return;

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.passwordResetTokenRepository.create({ userId: user.id, token, expiresAt });
    await this.emailAdapter.sendPasswordResetEmail(user.email, user.name, token);
  }
}
