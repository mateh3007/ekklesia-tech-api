import { GetAllMembersUsecase } from './get-all-members.usecase';

const mockMemberRepository = {
  findByChurchId: jest.fn(),
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
    usecase = new GetAllMembersUsecase(mockMemberRepository as any, mockCacheAdapter as any);
  });

  it('should return all members for the church', async () => {
    const members = [{ id: 'm1' }, { id: 'm2' }];
    mockMemberRepository.findByChurchId.mockResolvedValue(members);

    const result = await usecase.execute('cid');

    expect(result).toBe(members);
    expect(mockMemberRepository.findByChurchId).toHaveBeenCalledWith('cid');
  });

  it('should return empty array when church has no members', async () => {
    mockMemberRepository.findByChurchId.mockResolvedValue([]);

    const result = await usecase.execute('cid');

    expect(result).toEqual([]);
  });
});
