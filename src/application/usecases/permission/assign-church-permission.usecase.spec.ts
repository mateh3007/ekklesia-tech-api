import { ConflictException, NotFoundException } from '@nestjs/common';
import { AssignChurchPermissionUsecase } from './assign-church-permission.usecase';

const mockChurchPermissionRepository = {
  findByChurchId: jest.fn(),
  assign: jest.fn(),
};

const mockPermissionRepository = {
  findById: jest.fn(),
};

const mockChurchRepository = {
  findById: jest.fn(),
};

const mockCacheAdapter = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  deleteByPattern: jest.fn().mockResolvedValue(undefined),
};

describe('AssignChurchPermissionUsecase', () => {
  let usecase: AssignChurchPermissionUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new AssignChurchPermissionUsecase(
      mockChurchPermissionRepository as any,
      mockPermissionRepository as any,
      mockChurchRepository as any,
      mockCacheAdapter,
    );
  });

  it('should assign permission to church when all validations pass', async () => {
    const assigned = { id: 'cp-id', churchId: 'cid', permissionId: 'perm-id' };
    mockChurchRepository.findById.mockResolvedValue({ id: 'cid' });
    mockPermissionRepository.findById.mockResolvedValue({
      id: 'perm-id',
      name: 'CAN_INVITE',
    });
    mockChurchPermissionRepository.findByChurchId.mockResolvedValue([]);
    mockChurchPermissionRepository.assign.mockResolvedValue(assigned);

    const result = await usecase.execute('cid', 'perm-id');

    expect(result).toBe(assigned);
    expect(mockChurchPermissionRepository.assign).toHaveBeenCalledWith(
      'cid',
      'perm-id',
    );
  });

  it('should throw NotFoundException when church does not exist', async () => {
    mockChurchRepository.findById.mockResolvedValue(null);

    await expect(usecase.execute('cid', 'perm-id')).rejects.toThrow(
      NotFoundException,
    );
    expect(mockPermissionRepository.findById).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when permission does not exist', async () => {
    mockChurchRepository.findById.mockResolvedValue({ id: 'cid' });
    mockPermissionRepository.findById.mockResolvedValue(null);

    await expect(usecase.execute('cid', 'perm-id')).rejects.toThrow(
      NotFoundException,
    );
    expect(
      mockChurchPermissionRepository.findByChurchId,
    ).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when permission is already assigned to the church', async () => {
    mockChurchRepository.findById.mockResolvedValue({ id: 'cid' });
    mockPermissionRepository.findById.mockResolvedValue({ id: 'perm-id' });
    mockChurchPermissionRepository.findByChurchId.mockResolvedValue([
      { id: 'cp1', permissionId: 'perm-id', churchId: 'cid' },
    ]);

    await expect(usecase.execute('cid', 'perm-id')).rejects.toThrow(
      ConflictException,
    );
    expect(mockChurchPermissionRepository.assign).not.toHaveBeenCalled();
  });
});
