import { GetAllUsersUsecase } from './get-all-users.usecase';

const mockUserRepository = {
  findByChurchId: jest.fn(),
};

describe('GetAllUsersUsecase', () => {
  let usecase: GetAllUsersUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new GetAllUsersUsecase(mockUserRepository as any);
  });

  it('should return all users for the given church', async () => {
    const users = [{ id: 'u1' }, { id: 'u2' }];
    mockUserRepository.findByChurchId.mockResolvedValue(users);

    const result = await usecase.execute('church-id');

    expect(result).toBe(users);
    expect(mockUserRepository.findByChurchId).toHaveBeenCalledWith('church-id');
  });

  it('should return empty array when church has no users', async () => {
    mockUserRepository.findByChurchId.mockResolvedValue([]);

    const result = await usecase.execute('church-id');

    expect(result).toEqual([]);
  });
});
