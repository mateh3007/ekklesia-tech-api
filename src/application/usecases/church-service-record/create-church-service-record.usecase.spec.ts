import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateChurchServiceRecordUsecase } from './create-church-service-record.usecase';

const mockChurchServiceRecordRepository = {
  create: jest.fn(),
  findByServiceId: jest.fn(),
};

const mockChurchServiceRepository = {
  findById: jest.fn(),
};

const mockCacheAdapter = {
  deleteByPattern: jest.fn().mockResolvedValue(undefined),
};

const makeInput = () => ({
  churchId: 'cid',
  serviceId: 'sid',
  preacher: 'Pastor José',
  topic: 'Fé e Perseverança',
  bibleVerse: 'Hebreus 11:1',
  date: new Date('2026-06-08'),
});

describe('CreateChurchServiceRecordUsecase', () => {
  let usecase: CreateChurchServiceRecordUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new CreateChurchServiceRecordUsecase(
      mockChurchServiceRecordRepository as any,
      mockChurchServiceRepository as any,
      mockCacheAdapter as any,
    );
  });

  it('should create a church service record with a valid serviceId', async () => {
    const input = makeInput();
    const created = {
      id: 'rid',
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockChurchServiceRepository.findById.mockResolvedValue({
      id: 'sid',
      churchId: 'cid',
    });
    mockChurchServiceRecordRepository.findByServiceId.mockResolvedValue(null);
    mockChurchServiceRecordRepository.create.mockResolvedValue(created);

    const result = await usecase.execute(input);

    expect(result).toBe(created);
    expect(mockChurchServiceRepository.findById).toHaveBeenCalledWith('sid');
  });

  it('should throw NotFoundException when serviceId does not exist', async () => {
    mockChurchServiceRepository.findById.mockResolvedValue(null);

    await expect(usecase.execute(makeInput())).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw ForbiddenException when serviceId belongs to another church', async () => {
    mockChurchServiceRepository.findById.mockResolvedValue({
      id: 'sid',
      churchId: 'other-cid',
    });

    await expect(usecase.execute(makeInput())).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should throw ConflictException when a record already exists for the serviceId', async () => {
    mockChurchServiceRepository.findById.mockResolvedValue({
      id: 'sid',
      churchId: 'cid',
    });
    mockChurchServiceRecordRepository.findByServiceId.mockResolvedValue({
      id: 'existing-rid',
    });

    await expect(usecase.execute(makeInput())).rejects.toThrow(
      ConflictException,
    );
  });
});
