import {
  ConflictException,
  GoneException,
  NotFoundException,
} from '@nestjs/common';
import { InviteStatus } from '@prisma/client';
import { ValidateInviteUsecase } from './validate-invite.usecase';

const mockChurchInviteRepository = {
  findByToken: jest.fn(),
  updateStatus: jest.fn(),
};

const mockChurchRepository = {
  findById: jest.fn(),
};

const mockUserRepository = {
  findById: jest.fn(),
};

const makeInvite = (overrides = {}) => ({
  id: 'inv-id',
  churchId: 'cid',
  email: 'invited@user.com',
  status: InviteStatus.PENDING,
  token: 'valid-token',
  expiresAt: new Date(Date.now() + 48 * 3600 * 1000),
  invitedBy: 'admin-id',
  createdAt: new Date(),
  ...overrides,
});

const mockCacheAdapter = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  deleteByPattern: jest.fn().mockResolvedValue(undefined),
};

describe('ValidateInviteUsecase', () => {
  let usecase: ValidateInviteUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new ValidateInviteUsecase(
      mockChurchInviteRepository as any,
      mockChurchRepository as any,
      mockUserRepository as any,
      mockCacheAdapter,
    );
  });

  it('should return invite info when token is valid', async () => {
    const invite = makeInvite();
    mockChurchInviteRepository.findByToken.mockResolvedValue(invite);
    mockChurchRepository.findById.mockResolvedValue({
      id: 'cid',
      corporateName: 'Igreja Vida',
    });
    mockUserRepository.findById.mockResolvedValue({
      id: 'admin-id',
      name: 'Pastor Admin',
    });

    const result = await usecase.execute('valid-token');

    expect(result).toEqual({
      email: invite.email,
      churchName: 'Igreja Vida',
      inviterName: 'Pastor Admin',
    });
  });

  it('should throw NotFoundException when token is not found', async () => {
    mockChurchInviteRepository.findByToken.mockResolvedValue(null);

    await expect(usecase.execute('bad-token')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw GoneException and mark as EXPIRED when invite has expired', async () => {
    const expiredInvite = makeInvite({
      expiresAt: new Date(Date.now() - 1000),
    });
    mockChurchInviteRepository.findByToken.mockResolvedValue(expiredInvite);
    mockChurchInviteRepository.updateStatus.mockResolvedValue(undefined);

    await expect(usecase.execute('token')).rejects.toThrow(GoneException);
    expect(mockChurchInviteRepository.updateStatus).toHaveBeenCalledWith(
      expiredInvite.id,
      InviteStatus.EXPIRED,
    );
  });

  it('should throw ConflictException when invite has already been accepted', async () => {
    const acceptedInvite = makeInvite({ status: InviteStatus.ACCEPTED });
    mockChurchInviteRepository.findByToken.mockResolvedValue(acceptedInvite);

    await expect(usecase.execute('token')).rejects.toThrow(ConflictException);
  });
});
