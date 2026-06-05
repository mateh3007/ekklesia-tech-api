import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { GetAnnouncementByIdUsecase } from './get-announcement-by-id.usecase';

const mockAnnouncementRepository = {
  findById: jest.fn(),
};

const makeAnnouncement = (churchId = 'cid') => ({
  id: 'aid',
  churchId,
  title: 'Aviso',
  content: 'Conteúdo',
  date: new Date(),
});

describe('GetAnnouncementByIdUsecase', () => {
  let usecase: GetAnnouncementByIdUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new GetAnnouncementByIdUsecase(mockAnnouncementRepository as any);
  });

  it('should return announcement when found and belongs to the church', async () => {
    const announcement = makeAnnouncement('cid');
    mockAnnouncementRepository.findById.mockResolvedValue(announcement);

    const result = await usecase.execute('aid', 'cid');

    expect(result).toBe(announcement);
  });

  it('should throw NotFoundException when announcement does not exist', async () => {
    mockAnnouncementRepository.findById.mockResolvedValue(null);

    await expect(usecase.execute('aid', 'cid')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw ForbiddenException when announcement belongs to a different church', async () => {
    mockAnnouncementRepository.findById.mockResolvedValue(
      makeAnnouncement('other-cid'),
    );

    await expect(usecase.execute('aid', 'cid')).rejects.toThrow(
      ForbiddenException,
    );
  });
});
