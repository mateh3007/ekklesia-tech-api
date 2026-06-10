import { createHash } from 'crypto';

export const hashCacheKey = (value: string): string =>
  createHash('sha256').update(value.toLowerCase().trim()).digest('hex');

export const CacheKeys = {
  userById: (userId: string) => `user:id:${userId}`,
  churchPermissions: (churchId: string) => `church:permissions:${churchId}`,
  churchProfile: (churchId: string) => `church:profile:${churchId}`,
  churchServices: (churchId: string, page: number, limit: number) =>
    `church:services:${churchId}:p${page}:l${limit}`,
  churchServiceRecords: (churchId: string, page: number, limit: number) =>
    `church:service-records:${churchId}:p${page}:l${limit}`,
  churchEvents: (churchId: string, page: number, limit: number) =>
    `church:events:${churchId}:p${page}:l${limit}`,
  members: (churchId: string, page: number, limit: number) =>
    `church:members:${churchId}:p${page}:l${limit}`,
  users: (churchId: string, page: number, limit: number) =>
    `church:users:${churchId}:p${page}:l${limit}`,
  announcements: (churchId: string, page: number, limit: number) =>
    `church:announcements:${churchId}:p${page}:l${limit}`,
  prayerRequests: (churchId: string, page: number, limit: number) =>
    `church:prayer-requests:${churchId}:p${page}:l${limit}`,
  membersNoPagination: (churchId: string) => `church:members:${churchId}:no-pagination`,
  churchServicesNoPagination: (churchId: string) => `church:services:${churchId}:no-pagination`,
  churchServicesPattern: (churchId: string) => `church:services:${churchId}:*`,
  churchServiceRecordsPattern: (churchId: string) =>
    `church:service-records:${churchId}:*`,
  churchEventsPattern: (churchId: string) => `church:events:${churchId}:*`,
  membersPattern: (churchId: string) => `church:members:${churchId}:*`,
  usersPattern: (churchId: string) => `church:users:${churchId}:*`,
  announcementsPattern: (churchId: string) =>
    `church:announcements:${churchId}:*`,
  prayerRequestsPattern: (churchId: string) =>
    `church:prayer-requests:${churchId}:*`,
  agenda: (churchId: string, filter: string, date: string) =>
    `agenda:${churchId}:${filter}:${date}`,
  agendaPattern: (churchId: string) => `agenda:${churchId}:*`,
  inviteToken: (token: string) => `invite:token:${hashCacheKey(token)}`,
} as const;

export const CacheTTL = {
  PERMISSIONS: 3600,
  CHURCH_PROFILE: 3600,
  CHURCH_SERVICES: 1800,
  CHURCH_SERVICE_RECORDS: 300,
  CHURCH_EVENTS: 600,
  USER: 900,
  USERS: 300,
  MEMBERS: 600,
  ANNOUNCEMENTS: 300,
  PRAYER_REQUESTS: 300,
  AGENDA: 300,
} as const;
