import { GetAllPrayerRequestsUsecase } from './get-all-prayer-requests.usecase';

const mockPrayerRequestRepository = {
  findAllByChurchId: jest.fn(),
};

const mockCacheAdapter = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  deleteByPattern: jest.fn().mockResolvedValue(undefined),
};

describe('GetAllPrayerRequestsUsecase', () => {
  let usecase: GetAllPrayerRequestsUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new GetAllPrayerRequestsUsecase(
      mockPrayerRequestRepository as any,
      mockCacheAdapter,
    );
  });

  it('should return all prayer requests for the church', async () => {
    const requests = [{ id: 'pr1' }, { id: 'pr2' }];
    mockPrayerRequestRepository.findAllByChurchId.mockResolvedValue(requests);

    const result = await usecase.execute('cid');

    expect(result).toBe(requests);
    expect(mockPrayerRequestRepository.findAllByChurchId).toHaveBeenCalledWith(
      'cid',
    );
  });

  it('should return empty array when church has no prayer requests', async () => {
    mockPrayerRequestRepository.findAllByChurchId.mockResolvedValue([]);

    const result = await usecase.execute('cid');

    expect(result).toEqual([]);
  });
});
