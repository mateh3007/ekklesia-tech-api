import { CreateMemberUsecase } from './create-member.usecase';

const mockMemberRepository = {
  create: jest.fn(),
};

const mockCacheAdapter = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  deleteByPattern: jest.fn().mockResolvedValue(undefined),
};

describe('CreateMemberUsecase', () => {
  let usecase: CreateMemberUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new CreateMemberUsecase(
      mockMemberRepository as any,
      mockCacheAdapter,
    );
  });

  it('should create a member and return it', async () => {
    const input = {
      name: 'João Silva',
      phone: '11999999999',
      dateOfBirth: new Date('1990-01-01'),
    };
    const created = {
      id: 'mid',
      ...input,
      churchId: 'cid',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockMemberRepository.create.mockResolvedValue(created);

    const result = await usecase.execute(input, 'cid');

    expect(result).toBe(created);
    expect(mockMemberRepository.create).toHaveBeenCalledWith({
      ...input,
      churchId: 'cid',
    });
  });

  it('should create a member without optional phone field', async () => {
    const input = { name: 'Maria', dateOfBirth: new Date('1985-05-15') };
    const created = {
      id: 'mid',
      ...input,
      churchId: 'cid',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockMemberRepository.create.mockResolvedValue(created);

    const result = await usecase.execute(input, 'cid');

    expect(result).toBe(created);
  });
});
