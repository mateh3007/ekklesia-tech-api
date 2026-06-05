import { UnauthorizedException } from '@nestjs/common';
import { RefreshTokenUsecase } from './refresh-token.usecase';
import { Role } from 'src/domain/enums/role.enum';

const mockUserRepository = {
  findById: jest.fn(),
};

const mockJwtService = {
  verify: jest.fn(),
  sign: jest.fn(),
};

const makeUser = () => ({
  id: 'user-id',
  email: 'user@example.com',
  role: Role.ADMIN,
  churchId: 'church-id',
  name: 'User',
  phone: '123',
  passwordChangedAt: new Date('2024-01-01'),
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe('RefreshTokenUsecase', () => {
  let usecase: RefreshTokenUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new RefreshTokenUsecase(
      mockUserRepository as any,
      mockJwtService as any,
    );
  });

  it('should return new tokens when refresh token is valid', async () => {
    const user = makeUser();
    const pwdAt = user.passwordChangedAt.toISOString();
    mockJwtService.verify.mockReturnValue({ sub: user.id, pwdAt, type: 'refresh' });
    mockUserRepository.findById.mockResolvedValue(user);
    mockJwtService.sign.mockReturnValueOnce('new-access').mockReturnValueOnce('new-refresh');

    const result = await usecase.execute('valid-refresh-token');

    expect(result).toEqual({ accessToken: 'new-access', refreshToken: 'new-refresh' });
  });

  it('should handle user with no passwordChangedAt', async () => {
    const user = { ...makeUser(), passwordChangedAt: undefined };
    mockJwtService.verify.mockReturnValue({ sub: user.id, pwdAt: null, type: 'refresh' });
    mockUserRepository.findById.mockResolvedValue(user);
    mockJwtService.sign.mockReturnValue('token');

    const result = await usecase.execute('token');
    expect(result).toBeDefined();
  });

  it('should throw UnauthorizedException when jwt.verify throws', async () => {
    mockJwtService.verify.mockImplementation(() => { throw new Error('invalid'); });

    await expect(usecase.execute('bad-token')).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when token type is not refresh', async () => {
    mockJwtService.verify.mockReturnValue({ sub: 'id', pwdAt: null, type: 'access' });

    await expect(usecase.execute('access-token')).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when user is not found', async () => {
    mockJwtService.verify.mockReturnValue({ sub: 'id', pwdAt: null, type: 'refresh' });
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(usecase.execute('token')).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when password was changed after token issued', async () => {
    const user = makeUser();
    mockJwtService.verify.mockReturnValue({ sub: user.id, pwdAt: 'old-date', type: 'refresh' });
    mockUserRepository.findById.mockResolvedValue(user);

    await expect(usecase.execute('token')).rejects.toThrow(UnauthorizedException);
  });
});
