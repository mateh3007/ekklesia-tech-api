import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateAnnouncementUsecase } from './update-announcement.usecase';

const mockAnnouncementRepository = {
  findById: jest.fn(),
  update: jest.fn(),
};

const makeAnnouncement = (churchId = 'cid') => ({
  id: 'aid',
  churchId,
  title: 'Aviso',
  content: 'Conteúdo',
  date: new Date(),
});


const mockCacheAdapter = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  deleteByPattern: jest.fn().mockResolvedValue(undefined),
};

describe('UpdateAnnouncementUsecase', () => {
  let usecase: UpdateAnnouncementUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new UpdateAnnouncementUsecase(mockAnnouncementRepository as any, mockCacheAdapter as any);
  });

  it('should update announcement successfully', async () => {
    const announcement = makeAnnouncement('cid');
    const updated = { ...announcement, title: 'Aviso Atualizado' };
    mockAnnouncementRepository.findById.mockResolvedValue(announcement);
    mockAnnouncementRepository.update.mockResolvedValue(updated);

    const result = await usecase.execute(
      'aid',
      { title: 'Aviso Atualizado' },
      'cid',
    );

    expect(result).toBe(updated);
    expect(mockAnnouncementRepository.update).toHaveBeenCalledWith('aid', {
      title: 'Aviso Atualizado',
    });
  });

  it('should throw NotFoundException when announcement does not exist', async () => {
    mockAnnouncementRepository.findById.mockResolvedValue(null);

    await expect(usecase.execute('aid', {}, 'cid')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw ForbiddenException when announcement belongs to a different church', async () => {
    mockAnnouncementRepository.findById.mockResolvedValue(
      makeAnnouncement('other-cid'),
    );

    await expect(usecase.execute('aid', {}, 'cid')).rejects.toThrow(
      ForbiddenException,
    );
  });
});
