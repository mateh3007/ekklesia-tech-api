import {
  ConflictException,
  GoneException,
  NotFoundException,
} from '@nestjs/common';
import { InviteStatus } from '@prisma/client';
import { AcceptInviteUsecase } from './accept-invite.usecase';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
}));

const mockChurchInviteRepository = {
  findByToken: jest.fn(),
  updateStatus: jest.fn(),
};

const mockUserRepository = {
  create: jest.fn(),
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

describe('AcceptInviteUsecase', () => {
  let usecase: AcceptInviteUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new AcceptInviteUsecase(
      mockChurchInviteRepository as any,
      mockUserRepository as any,
      mockCacheAdapter as any,
    );
  });

  it('should accept invite and create user when invite is valid', async () => {
    const invite = makeInvite();
    const user = {
      id: 'uid',
      name: 'New User',
      email: invite.email,
      churchId: invite.churchId,
    };

    mockChurchInviteRepository.findByToken.mockResolvedValue(invite);
    mockUserRepository.create.mockResolvedValue(user);
    mockChurchInviteRepository.updateStatus.mockResolvedValue(undefined);

    const result = await usecase.execute('valid-token', {
      name: 'New User',
      password: 'pass123',
      phone: '123',
    });

    expect(result).toBe(user);
    expect(mockUserRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: invite.email,
        churchId: invite.churchId,
        password: 'hashed-password',
      }),
    );
    expect(mockChurchInviteRepository.updateStatus).toHaveBeenCalledWith(
      invite.id,
      InviteStatus.ACCEPTED,
    );
  });

  it('should throw NotFoundException when invite token is not found', async () => {
    mockChurchInviteRepository.findByToken.mockResolvedValue(null);

    await expect(
      usecase.execute('bad-token', {
        name: 'User',
        password: 'pass',
        phone: '123',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw GoneException and mark as EXPIRED when invite has expired', async () => {
    const expiredInvite = makeInvite({
      expiresAt: new Date(Date.now() - 1000),
    });
    mockChurchInviteRepository.findByToken.mockResolvedValue(expiredInvite);
    mockChurchInviteRepository.updateStatus.mockResolvedValue(undefined);

    await expect(
      usecase.execute('token', {
        name: 'User',
        password: 'pass',
        phone: '123',
      }),
    ).rejects.toThrow(GoneException);

    expect(mockChurchInviteRepository.updateStatus).toHaveBeenCalledWith(
      expiredInvite.id,
      InviteStatus.EXPIRED,
    );
  });

  it('should throw ConflictException when invite has already been accepted', async () => {
    const acceptedInvite = makeInvite({ status: InviteStatus.ACCEPTED });
    mockChurchInviteRepository.findByToken.mockResolvedValue(acceptedInvite);

    await expect(
      usecase.execute('token', {
        name: 'User',
        password: 'pass',
        phone: '123',
      }),
    ).rejects.toThrow(ConflictException);
  });
});
