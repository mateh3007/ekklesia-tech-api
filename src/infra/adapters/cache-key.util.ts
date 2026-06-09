import { createHash } from 'crypto';

export const hashCacheKey = (value: string): string =>
    createHash('sha256').update(value.toLowerCase().trim()).digest('hex');

export const CacheKeys = {
    userById: (userId: string) => `user:id:${userId}`,
    churchPermissions: (churchId: string) => `church:permissions:${churchId}`,
    churchProfile: (churchId: string) => `church:profile:${churchId}`,
    churchServices: (churchId: string) => `church:services:${churchId}`,
    churchEvents: (churchId: string) => `church:events:${churchId}`,
    members: (churchId: string) => `church:members:${churchId}`,
    announcements: (churchId: string) => `church:announcements:${churchId}`,
    prayerRequests: (churchId: string) => `church:prayer-requests:${churchId}`,
    agenda: (churchId: string, filter: string, date: string) =>
        `agenda:${churchId}:${filter}:${date}`,
    agendaPattern: (churchId: string) => `agenda:${churchId}:*`,
    inviteToken: (token: string) => `invite:token:${hashCacheKey(token)}`,
} as const;

export const CacheTTL = {
    PERMISSIONS: 3600,
    CHURCH_PROFILE: 3600,
    CHURCH_SERVICES: 1800,
    CHURCH_EVENTS: 600,
    USER: 900,
    MEMBERS: 600,
    ANNOUNCEMENTS: 300,
    PRAYER_REQUESTS: 300,
    AGENDA: 300,
} as const;
