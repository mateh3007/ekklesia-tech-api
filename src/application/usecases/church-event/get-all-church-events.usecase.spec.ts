import { GetAllChurchEventsUsecase } from './get-all-church-events.usecase';
import { PaginatedResult } from 'src/domain/types/paginated-result.type';

const mockChurchEventRepository = {
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

describe('GetAllChurchEventsUsecase', () => {
  let usecase: GetAllChurchEventsUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new GetAllChurchEventsUsecase(
      mockChurchEventRepository as any,
      mockCacheAdapter,
    );
  });

  it('should return paginated events for the church', async () => {
    const result = makePaginated([{ id: 'e1' }, { id: 'e2' }]);
    mockChurchEventRepository.findPaginated.mockResolvedValue(result);

    const response = await usecase.execute('cid', 1, 10);

    expect(response).toBe(result);
    expect(mockChurchEventRepository.findPaginated).toHaveBeenCalledWith(
      'cid',
      1,
      10,
    );
  });

  it('should return empty paginated result when no events exist', async () => {
    const result = makePaginated([]);
    mockChurchEventRepository.findPaginated.mockResolvedValue(result);

    const response = await usecase.execute('cid', 1, 10);

    expect(response.data).toEqual([]);
    expect(response.total).toBe(0);
  });

  it('should return cached result without hitting the repository', async () => {
    const cached = makePaginated([{ id: 'e1' }]);
    mockCacheAdapter.get.mockResolvedValueOnce(cached);

    const response = await usecase.execute('cid', 1, 10);

    expect(response).toBe(cached);
    expect(mockChurchEventRepository.findPaginated).not.toHaveBeenCalled();
  });
});
