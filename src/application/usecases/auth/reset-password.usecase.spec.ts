import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ResetPasswordUsecase } from './reset-password.usecase';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('new-hashed-password'),
}));

const mockUserRepository = {
  updatePassword: jest.fn(),
};

const mockPasswordResetTokenRepository = {
  findByToken: jest.fn(),
  markAsUsed: jest.fn(),
};

const makeToken = (overrides = {}) => ({
  id: 'token-id',
  userId: 'user-id',
  token: 'valid-token',
  expiresAt: new Date(Date.now() + 3600 * 1000),
  usedAt: null,
  createdAt: new Date(),
  ...overrides,
});

describe('ResetPasswordUsecase', () => {
  let usecase: ResetPasswordUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new ResetPasswordUsecase(
      mockUserRepository as any,
      mockPasswordResetTokenRepository as any,
    );
  });

  it('should update password successfully with a valid token', async () => {
    const token = makeToken();
    mockPasswordResetTokenRepository.findByToken.mockResolvedValue(token);
    mockUserRepository.updatePassword.mockResolvedValue(undefined);
    mockPasswordResetTokenRepository.markAsUsed.mockResolvedValue(undefined);

    await usecase.execute({ token: token.token, newPassword: 'newPass123' });

    expect(mockUserRepository.updatePassword).toHaveBeenCalledWith(token.userId, 'new-hashed-password');
    expect(mockPasswordResetTokenRepository.markAsUsed).toHaveBeenCalledWith(token.id);
  });

  it('should throw BadRequestException when token is not found', async () => {
    mockPasswordResetTokenRepository.findByToken.mockResolvedValue(null);

    await expect(usecase.execute({ token: 'bad', newPassword: 'pass' })).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when token has already been used', async () => {
    const token = makeToken({ usedAt: new Date() });
    mockPasswordResetTokenRepository.findByToken.mockResolvedValue(token);

    await expect(usecase.execute({ token: token.token, newPassword: 'pass' })).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when token has expired', async () => {
    const token = makeToken({ expiresAt: new Date(Date.now() - 1000) });
    mockPasswordResetTokenRepository.findByToken.mockResolvedValue(token);

    await expect(usecase.execute({ token: token.token, newPassword: 'pass' })).rejects.toThrow(BadRequestException);
  });
});
