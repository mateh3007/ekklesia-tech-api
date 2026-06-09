import { GetAllAnnouncementsUsecase } from './get-all-announcements.usecase';

const mockAnnouncementRepository = {
  findAllByChurchId: jest.fn(),
};

const mockCacheAdapter = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  deleteByPattern: jest.fn().mockResolvedValue(undefined),
};

describe('GetAllAnnouncementsUsecase', () => {
  let usecase: GetAllAnnouncementsUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new GetAllAnnouncementsUsecase(
      mockAnnouncementRepository as any,
      mockCacheAdapter,
    );
  });

  it('should return all announcements for the church', async () => {
    const announcements = [{ id: 'a1' }, { id: 'a2' }];
    mockAnnouncementRepository.findAllByChurchId.mockResolvedValue(
      announcements,
    );

    const result = await usecase.execute('cid');

    expect(result).toBe(announcements);
    expect(mockAnnouncementRepository.findAllByChurchId).toHaveBeenCalledWith(
      'cid',
    );
  });

  it('should return empty array when church has no announcements', async () => {
    mockAnnouncementRepository.findAllByChurchId.mockResolvedValue([]);

    const result = await usecase.execute('cid');

    expect(result).toEqual([]);
  });

  it('should return cached announcements without hitting the repository', async () => {
    const cached = [{ id: 'a1' }];
    mockCacheAdapter.get.mockResolvedValueOnce(cached);

    const result = await usecase.execute('cid');

    expect(result).toBe(cached);
    expect(mockAnnouncementRepository.findAllByChurchId).not.toHaveBeenCalled();
  });
});
