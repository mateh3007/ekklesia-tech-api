import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './infra/config/prisma/prisma.module';
import { CacheModule } from './infra/modules/cache/cache.module';
import { RegisterModule } from './infra/modules/register/register.module';
import { ChurchModule } from './infra/modules/church/church.module';
import { UserModule } from './infra/modules/user/user.module';
import { AuthModule } from './infra/modules/auth/auth.module';
import { PermissionModule } from './infra/modules/permission/permission.module';
import { ChurchServiceModule } from './infra/modules/church-service/church-service.module';
import { ChurchEventModule } from './infra/modules/church-event/church-event.module';
import { InviteModule } from './infra/modules/invite/invite.module';
import { AgendaModule } from './infra/modules/agenda/agenda.module';
import { MemberModule } from './infra/modules/member/member.module';
import { ChurchProfileModule } from './infra/modules/church-profile/church-profile.module';
import { ChurchServiceRecordModule } from './infra/modules/church-service-record/church-service-record.module';
import { AnnouncementModule } from './infra/modules/announcement/announcement.module';
import { PrayerRequestModule } from './infra/modules/prayer-request/prayer-request.module';
import { JwtAuthGuard } from './infra/config/jwt/jwt-auth.guard';
import { RolesGuard } from './infra/config/rbac/roles.guard';
import { PermissionsGuard } from './infra/config/abac/permissions.guard';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 60,
      },
    ]),
    CacheModule,
    PrismaModule,
    RegisterModule,
    ChurchModule,
    UserModule,
    AuthModule,
    PermissionModule,
    ChurchServiceModule,
    ChurchEventModule,
    InviteModule,
    AgendaModule,
    MemberModule,
    ChurchProfileModule,
    ChurchServiceRecordModule,
    AnnouncementModule,
    PrayerRequestModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class AppModule {}
