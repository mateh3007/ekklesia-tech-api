import { GetAllChurchServicesUsecase } from './get-all-church-services.usecase';
import { PaginatedResult } from 'src/domain/types/paginated-result.type';

const mockChurchServiceRepository = {
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

describe('GetAllChurchServicesUsecase', () => {
  let usecase: GetAllChurchServicesUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new GetAllChurchServicesUsecase(
      mockChurchServiceRepository as any,
      mockCacheAdapter,
    );
  });

  it('should return paginated services for the church', async () => {
    const result = makePaginated([{ id: 's1' }, { id: 's2' }]);
    mockChurchServiceRepository.findPaginated.mockResolvedValue(result);

    const response = await usecase.execute('cid', 1, 10);

    expect(response).toBe(result);
    expect(mockChurchServiceRepository.findPaginated).toHaveBeenCalledWith(
      'cid',
      1,
      10,
    );
  });

  it('should return empty paginated result when no services exist', async () => {
    const result = makePaginated([]);
    mockChurchServiceRepository.findPaginated.mockResolvedValue(result);

    const response = await usecase.execute('cid', 1, 10);

    expect(response.data).toEqual([]);
    expect(response.total).toBe(0);
  });

  it('should return cached result without hitting the repository', async () => {
    const cached = makePaginated([{ id: 's1' }]);
    mockCacheAdapter.get.mockResolvedValueOnce(cached);

    const response = await usecase.execute('cid', 1, 10);

    expect(response).toBe(cached);
    expect(mockChurchServiceRepository.findPaginated).not.toHaveBeenCalled();
  });
});
