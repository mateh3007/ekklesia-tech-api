import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginUsecase } from './login.usecase';
import { Role } from 'src/domain/enums/role.enum';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

const mockUserRepository = {
  findByEmail: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

const makeUser = () => ({
  id: 'user-id',
  email: 'user@example.com',
  password: 'hashed',
  role: Role.ADMIN,
  churchId: 'church-id',
  name: 'User',
  phone: '123',
  passwordChangedAt: new Date('2024-01-01'),
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe('LoginUsecase', () => {
  let usecase: LoginUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new LoginUsecase(
      mockUserRepository as any,
      mockJwtService as any,
    );
  });

  it('should return access and refresh tokens on valid credentials', async () => {
    const user = makeUser();
    mockUserRepository.findByEmail.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    mockJwtService.sign
      .mockReturnValueOnce('access-token')
      .mockReturnValueOnce('refresh-token');

    const result = await usecase.execute({
      email: user.email,
      password: 'pass',
    });

    expect(result).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(user.email);
    expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
  });

  it('should include pwdAt as null when passwordChangedAt is undefined', async () => {
    const user = { ...makeUser(), passwordChangedAt: undefined };
    mockUserRepository.findByEmail.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    mockJwtService.sign.mockReturnValue('token');

    await usecase.execute({ email: user.email, password: 'pass' });

    const refreshCallArgs = mockJwtService.sign.mock.calls[1][0];
    expect(refreshCallArgs.pwdAt).toBeNull();
  });

  it('should throw UnauthorizedException when user is not found', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(
      usecase.execute({ email: 'x@x.com', password: 'pass' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when password does not match', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(makeUser());
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      usecase.execute({ email: 'x@x.com', password: 'wrong' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
