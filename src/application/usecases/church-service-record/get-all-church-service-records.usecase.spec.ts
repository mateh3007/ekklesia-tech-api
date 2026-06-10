import { GetAllChurchServiceRecordsUsecase } from './get-all-church-service-records.usecase';
import { PaginatedResult } from 'src/domain/types/paginated-result.type';

const mockChurchServiceRecordRepository = {
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

describe('GetAllChurchServiceRecordsUsecase', () => {
  let usecase: GetAllChurchServiceRecordsUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new GetAllChurchServiceRecordsUsecase(
      mockChurchServiceRecordRepository as any,
      mockCacheAdapter,
    );
  });

  it('should return paginated records for the church', async () => {
    const result = makePaginated([{ id: 'r1' }, { id: 'r2' }]);
    mockChurchServiceRecordRepository.findPaginated.mockResolvedValue(result);

    const response = await usecase.execute('cid', 1, 10);

    expect(response).toBe(result);
    expect(
      mockChurchServiceRecordRepository.findPaginated,
    ).toHaveBeenCalledWith('cid', 1, 10);
  });

  it('should return empty paginated result when no records exist', async () => {
    const result = makePaginated([]);
    mockChurchServiceRecordRepository.findPaginated.mockResolvedValue(result);

    const response = await usecase.execute('cid', 1, 10);

    expect(response.data).toEqual([]);
    expect(response.total).toBe(0);
  });

  it('should return cached result without hitting the repository', async () => {
    const cached = makePaginated([{ id: 'r1' }]);
    mockCacheAdapter.get.mockResolvedValueOnce(cached);

    const response = await usecase.execute('cid', 1, 10);

    expect(response).toBe(cached);
    expect(
      mockChurchServiceRecordRepository.findPaginated,
    ).not.toHaveBeenCalled();
  });
});
