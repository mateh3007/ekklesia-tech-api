import { BadRequestException } from '@nestjs/common';
import { CreateUserUsecase } from './create-user.usecase';
import { Role } from 'src/domain/enums/role.enum';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-pass'),
}));

const mockUserRepository = {
  findByEmail: jest.fn(),
  create: jest.fn(),
};

const makeInput = (role = Role.SUPERVISOR) => ({
  name: 'Test User',
  email: 'test@test.com',
  password: 'pass123',
  phone: '123',
  role,
});

describe('CreateUserUsecase', () => {
  let usecase: CreateUserUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new CreateUserUsecase(mockUserRepository as any);
  });

  it('should create user successfully', async () => {
    const input = makeInput();
    const created = {
      id: 'uid',
      ...input,
      churchId: 'cid',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.create.mockResolvedValue(created);

    const result = await usecase.execute(input, 'cid');

    expect(result).toBe(created);
    expect(mockUserRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ churchId: 'cid', password: 'hashed-pass' }),
    );
  });

  it('should throw BadRequestException when trying to create admin user', async () => {
    await expect(usecase.execute(makeInput(Role.ADMIN), 'cid')).rejects.toThrow(
      BadRequestException,
    );
    expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when email already in use', async () => {
    mockUserRepository.findByEmail.mockResolvedValue({ id: 'existing' });

    await expect(usecase.execute(makeInput(), 'cid')).rejects.toThrow(
      BadRequestException,
    );
    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });
});
