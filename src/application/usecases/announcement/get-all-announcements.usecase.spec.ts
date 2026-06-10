import { GetAllAnnouncementsUsecase } from './get-all-announcements.usecase';
import { PaginatedResult } from 'src/domain/types/paginated-result.type';

const mockAnnouncementRepository = {
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

describe('GetAllAnnouncementsUsecase', () => {
  let usecase: GetAllAnnouncementsUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new GetAllAnnouncementsUsecase(
      mockAnnouncementRepository as any,
      mockCacheAdapter,
    );
  });

  it('should return paginated announcements for the church', async () => {
    const result = makePaginated([{ id: 'a1' }, { id: 'a2' }]);
    mockAnnouncementRepository.findPaginated.mockResolvedValue(result);

    const response = await usecase.execute('cid', 1, 10);

    expect(response).toBe(result);
    expect(mockAnnouncementRepository.findPaginated).toHaveBeenCalledWith(
      'cid',
      1,
      10,
    );
  });

  it('should return empty paginated result when no announcements exist', async () => {
    const result = makePaginated([]);
    mockAnnouncementRepository.findPaginated.mockResolvedValue(result);

    const response = await usecase.execute('cid', 1, 10);

    expect(response.data).toEqual([]);
    expect(response.total).toBe(0);
  });

  it('should return cached result without hitting the repository', async () => {
    const cached = makePaginated([{ id: 'a1' }]);
    mockCacheAdapter.get.mockResolvedValueOnce(cached);

    const response = await usecase.execute('cid', 1, 10);

    expect(response).toBe(cached);
    expect(mockAnnouncementRepository.findPaginated).not.toHaveBeenCalled();
  });
});
