import { GetAllUsersUsecase } from './get-all-users.usecase';
import { PaginatedResult } from 'src/domain/types/paginated-result.type';

const mockUserRepository = {
  findByChurchIdPaginated: jest.fn(),
};

const mockCacheAdapter = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  deleteByPattern: jest.fn().mockResolvedValue(undefined),
};

const makePaginated = (data: unknown[]): PaginatedResult<unknown> => ({
  data,
  total: data.length,
  page: 1,
  limit: 10,
  totalPages: 1,
});

describe('GetAllUsersUsecase', () => {
  let usecase: GetAllUsersUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new GetAllUsersUsecase(
      mockUserRepository as any,
      mockCacheAdapter,
    );
  });

  it('should return paginated users for the given church', async () => {
    const result = makePaginated([{ id: 'u1' }, { id: 'u2' }]);
    mockUserRepository.findByChurchIdPaginated.mockResolvedValue(result);

    const response = await usecase.execute('cid', 1, 10);

    expect(response).toBe(result);
    expect(mockUserRepository.findByChurchIdPaginated).toHaveBeenCalledWith('cid', 1, 10);
  });

  it('should return empty paginated result when no users exist', async () => {
    const result = makePaginated([]);
    mockUserRepository.findByChurchIdPaginated.mockResolvedValue(result);

    const response = await usecase.execute('cid', 1, 10);

    expect(response.data).toEqual([]);
    expect(response.total).toBe(0);
  });

  it('should return cached result without hitting the repository', async () => {
    const cached = makePaginated([{ id: 'u1' }]);
    mockCacheAdapter.get.mockResolvedValueOnce(cached);

    const response = await usecase.execute('cid', 1, 10);

    expect(response).toBe(cached);
    expect(mockUserRepository.findByChurchIdPaginated).not.toHaveBeenCalled();
  });
});
