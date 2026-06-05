import { ConflictException, ForbiddenException } from '@nestjs/common';
import { InviteStatus } from '@prisma/client';
import { CreateInviteUsecase } from './create-invite.usecase';
import { Role } from 'src/domain/enums/role.enum';

const mockChurchInviteRepository = {
  findPendingByEmailAndChurch: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
};

const mockUserRepository = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
};

const mockChurchRepository = {
  findById: jest.fn(),
};

const mockEmailAdapter = {
  sendInviteEmail: jest.fn(),
};

const makeRequester = (role = Role.ADMIN, churchId = 'cid') => ({
  id: 'req-id',
  email: 'admin@church.com',
  role,
  churchId,
});

describe('CreateInviteUsecase', () => {
  let usecase: CreateInviteUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new CreateInviteUsecase(
      mockChurchInviteRepository as any,
      mockUserRepository as any,
      mockChurchRepository as any,
      mockEmailAdapter as any,
    );
  });

  it('should create an invite and send email when all validations pass', async () => {
    const requester = makeRequester();
    const invite = {
      id: 'inv-id',
      churchId: 'cid',
      email: 'new@user.com',
      status: InviteStatus.PENDING,
      token: 'abc123',
      expiresAt: new Date(),
      invitedBy: requester.id,
      createdAt: new Date(),
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockChurchInviteRepository.findPendingByEmailAndChurch.mockResolvedValue(
      null,
    );
    mockChurchInviteRepository.create.mockResolvedValue(invite);
    mockChurchRepository.findById.mockResolvedValue({
      id: 'cid',
      corporateName: 'Igreja',
    });
    mockUserRepository.findById.mockResolvedValue({
      id: requester.id,
      name: 'Admin',
    });
    mockEmailAdapter.sendInviteEmail.mockResolvedValue(undefined);

    const result = await usecase.execute('cid', 'new@user.com', requester);

    expect(result).toBe(invite);
    expect(mockEmailAdapter.sendInviteEmail).toHaveBeenCalled();
  });

  it('should allow SUPERADMIN to invite to any church', async () => {
    const requester = makeRequester(Role.SUPERADMIN, 'different-church');
    const invite = {
      id: 'inv-id',
      churchId: 'cid',
      email: 'new@user.com',
      status: InviteStatus.PENDING,
      token: 'abc',
      expiresAt: new Date(),
      invitedBy: requester.id,
      createdAt: new Date(),
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockChurchInviteRepository.findPendingByEmailAndChurch.mockResolvedValue(
      null,
    );
    mockChurchInviteRepository.create.mockResolvedValue(invite);
    mockChurchRepository.findById.mockResolvedValue({
      id: 'cid',
      corporateName: 'Igreja',
    });
    mockUserRepository.findById.mockResolvedValue({
      id: requester.id,
      name: 'Super',
    });
    mockEmailAdapter.sendInviteEmail.mockResolvedValue(undefined);

    await expect(
      usecase.execute('cid', 'new@user.com', requester),
    ).resolves.toBeDefined();
  });

  it('should throw ForbiddenException when admin tries to invite to another church', async () => {
    const requester = makeRequester(Role.ADMIN, 'other-church');

    await expect(
      usecase.execute('cid', 'new@user.com', requester),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException when a non-admin user tries to invite', async () => {
    const requester = makeRequester(Role.USER, 'cid');

    await expect(
      usecase.execute('cid', 'new@user.com', requester),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should throw ConflictException when email already has an account', async () => {
    const requester = makeRequester();
    mockUserRepository.findByEmail.mockResolvedValue({ id: 'existing-user' });

    await expect(
      usecase.execute('cid', 'existing@user.com', requester),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw ConflictException when there is already a pending invite', async () => {
    const requester = makeRequester();
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockChurchInviteRepository.findPendingByEmailAndChurch.mockResolvedValue({
      id: 'existing-invite',
    });

    await expect(
      usecase.execute('cid', 'new@user.com', requester),
    ).rejects.toThrow(ConflictException);
  });
});
