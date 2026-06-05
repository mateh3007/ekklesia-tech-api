import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { DeleteAnnouncementUsecase } from './delete-announcement.usecase';

const mockAnnouncementRepository = {
  findById: jest.fn(),
  softDelete: jest.fn(),
};

const makeAnnouncement = (churchId = 'cid') => ({
  id: 'aid',
  churchId,
  title: 'Aviso',
  content: 'Conteúdo',
  date: new Date(),
});

describe('DeleteAnnouncementUsecase', () => {
  let usecase: DeleteAnnouncementUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new DeleteAnnouncementUsecase(mockAnnouncementRepository as any);
  });

  it('should soft delete announcement when found and belongs to the church', async () => {
    mockAnnouncementRepository.findById.mockResolvedValue(
      makeAnnouncement('cid'),
    );
    mockAnnouncementRepository.softDelete.mockResolvedValue(undefined);

    await usecase.execute('aid', 'cid');

    expect(mockAnnouncementRepository.softDelete).toHaveBeenCalledWith('aid');
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
