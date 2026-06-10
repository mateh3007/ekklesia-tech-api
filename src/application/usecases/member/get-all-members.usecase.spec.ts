import { GetAllMembersUsecase } from './get-all-members.usecase';
import { Role } from 'src/domain/enums/role.enum';

const mockMemberRepository = {
  findByChurchId: jest.fn(),
};

const mockUserRepository = {
  findByChurchIdAndRoles: jest.fn(),
};

const mockCacheAdapter = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  deleteByPattern: jest.fn().mockResolvedValue(undefined),
};

describe('GetAllMembersUsecase', () => {
  let usecase: GetAllMembersUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new GetAllMembersUsecase(
      mockMemberRepository as any,
      mockUserRepository as any,
      mockCacheAdapter,
    );
  });

  it('should return paginated result combining members and admin/supervisor users', async () => {
    const members = [{ id: 'm1', churchId: 'cid', name: 'Member' }];
    const adminUsers = [
      {
        id: 'u1',
        churchId: 'cid',
        name: 'Admin',
        phone: '(11) 99999-9999',
        role: Role.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    mockMemberRepository.findByChurchId.mockResolvedValue(members);
    mockUserRepository.findByChurchIdAndRoles.mockResolvedValue(adminUsers);

    const result = await usecase.execute('cid', 1, 10);

    expect(result.total).toBe(2);
    expect(result.data).toHaveLength(2);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.totalPages).toBe(1);
    expect(mockUserRepository.findByChurchIdAndRoles).toHaveBeenCalledWith(
      'cid',
      [Role.ADMIN, Role.SUPERVISOR],
    );
  });

  it('should correctly paginate the combined list', async () => {
    const members = Array.from({ length: 8 }, (_, i) => ({ id: `m${i}` }));
    const adminUsers = Array.from({ length: 5 }, (_, i) => ({
      id: `u${i}`,
      churchId: 'cid',
      name: `Admin ${i}`,
      phone: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    mockMemberRepository.findByChurchId.mockResolvedValue(members);
    mockUserRepository.findByChurchIdAndRoles.mockResolvedValue(adminUsers);

    const result = await usecase.execute('cid', 2, 5);

    expect(result.total).toBe(13);
    expect(result.data).toHaveLength(5);
    expect(result.page).toBe(2);
    expect(result.totalPages).toBe(3);
  });

  it('should return empty paginated result when no data exists', async () => {
    mockMemberRepository.findByChurchId.mockResolvedValue([]);
    mockUserRepository.findByChurchIdAndRoles.mockResolvedValue([]);

    const result = await usecase.execute('cid', 1, 10);

    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('should return cached result without hitting repositories', async () => {
    const cached = {
      data: [{ id: 'm1' }],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    };
    mockCacheAdapter.get.mockResolvedValueOnce(cached);

    const result = await usecase.execute('cid', 1, 10);

    expect(result).toBe(cached);
    expect(mockMemberRepository.findByChurchId).not.toHaveBeenCalled();
    expect(mockUserRepository.findByChurchIdAndRoles).not.toHaveBeenCalled();
  });
});
