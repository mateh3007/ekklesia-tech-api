import { GetAllAnnouncementsUsecase } from './get-all-announcements.usecase';

const mockAnnouncementRepository = {
  findAllByChurchId: jest.fn(),
};

describe('GetAllAnnouncementsUsecase', () => {
  let usecase: GetAllAnnouncementsUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new GetAllAnnouncementsUsecase(mockAnnouncementRepository as any);
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
});
