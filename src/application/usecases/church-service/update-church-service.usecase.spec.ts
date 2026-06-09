import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateChurchServiceUsecase } from './update-church-service.usecase';

const mockChurchServiceRepository = {
  findById: jest.fn(),
  update: jest.fn(),
};


const mockCacheAdapter = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  deleteByPattern: jest.fn().mockResolvedValue(undefined),
};

describe('UpdateChurchServiceUsecase', () => {
  let usecase: UpdateChurchServiceUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new UpdateChurchServiceUsecase(
      mockChurchServiceRepository as any,
      mockCacheAdapter as any,
    );
  });

  it('should update church service successfully', async () => {
    const service = { id: 'sid', churchId: 'cid', title: 'Culto' };
    const updated = { ...service, title: 'Culto Atualizado' };
    mockChurchServiceRepository.findById.mockResolvedValue(service);
    mockChurchServiceRepository.update.mockResolvedValue(updated);

    const result = await usecase.execute(
      'sid',
      { title: 'Culto Atualizado' },
      'cid',
    );

    expect(result).toBe(updated);
  });

  it('should throw NotFoundException when service does not exist', async () => {
    mockChurchServiceRepository.findById.mockResolvedValue(null);

    await expect(usecase.execute('sid', {}, 'cid')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw ForbiddenException when service belongs to a different church', async () => {
    mockChurchServiceRepository.findById.mockResolvedValue({
      id: 'sid',
      churchId: 'other-cid',
    });

    await expect(usecase.execute('sid', {}, 'cid')).rejects.toThrow(
      ForbiddenException,
    );
  });
});
