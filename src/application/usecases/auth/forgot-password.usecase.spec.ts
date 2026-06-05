import { ForgotPasswordUsecase } from './forgot-password.usecase';

const mockUserRepository = {
  findByEmail: jest.fn(),
};

const mockPasswordResetTokenRepository = {
  create: jest.fn(),
};

const mockEmailAdapter = {
  sendPasswordResetEmail: jest.fn(),
};

describe('ForgotPasswordUsecase', () => {
  let usecase: ForgotPasswordUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new ForgotPasswordUsecase(
      mockUserRepository as any,
      mockPasswordResetTokenRepository as any,
      mockEmailAdapter as any,
    );
  });

  it('should create a reset token and send email when user exists', async () => {
    const user = { id: 'user-id', email: 'user@test.com', name: 'User' };
    mockUserRepository.findByEmail.mockResolvedValue(user);
    mockPasswordResetTokenRepository.create.mockResolvedValue({});
    mockEmailAdapter.sendPasswordResetEmail.mockResolvedValue(undefined);

    await usecase.execute(user.email);

    expect(mockPasswordResetTokenRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: user.id }),
    );
    expect(mockEmailAdapter.sendPasswordResetEmail).toHaveBeenCalledWith(
      user.email,
      user.name,
      expect.any(String),
    );
  });

  it('should return silently when user does not exist (security: no user enumeration)', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(usecase.execute('unknown@test.com')).resolves.toBeUndefined();
    expect(mockPasswordResetTokenRepository.create).not.toHaveBeenCalled();
    expect(mockEmailAdapter.sendPasswordResetEmail).not.toHaveBeenCalled();
  });
});
