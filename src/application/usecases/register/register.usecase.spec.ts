import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterUsecase } from './register.usecase';
import { Role } from 'src/domain/enums/role.enum';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
}));

const mockChurchRepository = {
  findByCnpj: jest.fn(),
  create: jest.fn(),
};

const mockUserRepository = {
  create: jest.fn(),
};

const makeInput = () => ({
  corporateName: 'Igreja Teste',
  cnpj: '12.345.678/0001-99',
  phone: '11999999999',
  name: 'Pastor Admin',
  email: 'admin@igreja.com',
  password: 'senha123',
});

describe('RegisterUsecase', () => {
  let usecase: RegisterUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new RegisterUsecase(mockChurchRepository as any, mockUserRepository as any);
  });

  it('should register a new church and admin user successfully', async () => {
    const input = makeInput();
    const church = { id: 'church-id', ...input };
    mockChurchRepository.findByCnpj.mockResolvedValue(null);
    mockChurchRepository.create.mockResolvedValue(church);
    mockUserRepository.create.mockResolvedValue({});

    await usecase.execute(input);

    expect(mockChurchRepository.create).toHaveBeenCalledWith({
      corporateName: input.corporateName,
      cnpj: input.cnpj,
      phone: input.phone,
      email: input.email,
    });
    expect(mockUserRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        role: Role.ADMIN,
        churchId: church.id,
        password: 'hashed-password',
      }),
    );
  });

  it('should throw BadRequestException when church with same CNPJ already exists', async () => {
    mockChurchRepository.findByCnpj.mockResolvedValue({ id: 'existing-church' });

    await expect(usecase.execute(makeInput())).rejects.toThrow(BadRequestException);
    expect(mockChurchRepository.create).not.toHaveBeenCalled();
  });
});
