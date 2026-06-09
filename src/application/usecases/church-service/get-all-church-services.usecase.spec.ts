import { GetAllChurchServicesUsecase } from './get-all-church-services.usecase';

const mockChurchServiceRepository = {
  findAll: jest.fn(),
};

const mockCacheAdapter = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  deleteByPattern: jest.fn().mockResolvedValue(undefined),
};

describe('GetAllChurchServicesUsecase', () => {
  let usecase: GetAllChurchServicesUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new GetAllChurchServicesUsecase(
      mockChurchServiceRepository as any,
      mockCacheAdapter,
    );
  });

  it('should return all services for the church', async () => {
    const services = [{ id: 's1' }, { id: 's2' }];
    mockChurchServiceRepository.findAll.mockResolvedValue(services);

    const result = await usecase.execute('cid');

    expect(result).toBe(services);
    expect(mockChurchServiceRepository.findAll).toHaveBeenCalledWith('cid');
  });

  it('should return empty array when church has no services', async () => {
    mockChurchServiceRepository.findAll.mockResolvedValue([]);

    const result = await usecase.execute('cid');

    expect(result).toEqual([]);
  });

  it('should return cached services without hitting the repository', async () => {
    const cached = [{ id: 's1' }];
    mockCacheAdapter.get.mockResolvedValueOnce(cached);

    const result = await usecase.execute('cid');

    expect(result).toBe(cached);
    expect(mockChurchServiceRepository.findAll).not.toHaveBeenCalled();
  });
});
