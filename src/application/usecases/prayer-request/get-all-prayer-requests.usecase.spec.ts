import { GetAllPrayerRequestsUsecase } from './get-all-prayer-requests.usecase';
import { PaginatedResult } from 'src/domain/types/paginated-result.type';

const mockPrayerRequestRepository = {
  findPaginated: jest.fn(),
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

describe('GetAllPrayerRequestsUsecase', () => {
  let usecase: GetAllPrayerRequestsUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new GetAllPrayerRequestsUsecase(
      mockPrayerRequestRepository as any,
      mockCacheAdapter,
    );
  });

  it('should return paginated prayer requests for the church', async () => {
    const result = makePaginated([{ id: 'pr1' }, { id: 'pr2' }]);
    mockPrayerRequestRepository.findPaginated.mockResolvedValue(result);

    const response = await usecase.execute('cid', 1, 10);

    expect(response).toBe(result);
    expect(mockPrayerRequestRepository.findPaginated).toHaveBeenCalledWith(
      'cid',
      1,
      10,
    );
  });

  it('should return empty paginated result when no prayer requests exist', async () => {
    const result = makePaginated([]);
    mockPrayerRequestRepository.findPaginated.mockResolvedValue(result);

    const response = await usecase.execute('cid', 1, 10);

    expect(response.data).toEqual([]);
    expect(response.total).toBe(0);
  });

  it('should return cached result without hitting the repository', async () => {
    const cached = makePaginated([{ id: 'pr1' }]);
    mockCacheAdapter.get.mockResolvedValueOnce(cached);

    const response = await usecase.execute('cid', 1, 10);

    expect(response).toBe(cached);
    expect(mockPrayerRequestRepository.findPaginated).not.toHaveBeenCalled();
  });
});
