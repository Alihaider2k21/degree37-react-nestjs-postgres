import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Locations } from 'src/api/system-configuration/tenants-administration/crm-administration/locations/location/entity/location.entity';
import { OperationsStatus } from 'src/api/system-configuration/tenants-administration/operations-administration/booking-drives/operation-status/entities/operations_status.entity';
import { CrmNonCollectionProfiles } from 'src/api/crm/crm-non-collection-profiles/entities/crm-non-collection-profiles.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { OcNonCollectionEventsChangeAuditService } from './service/oc-non-collection-events-change-audit.service';
import { JwtService } from '@nestjs/jwt';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { NonCollectionEvents } from './entities/oc-non-collection-events.entity';
import { OcNonCollectionEventsChangeAuditController } from './controller/oc-non-collection-events-change-audit.controller';
import { NonCollectionEventsHistory } from './entities/oc-non-collection-events-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Locations,
      OperationsStatus,
      CrmNonCollectionProfiles,
      Tenant,
      Permissions,
      NonCollectionEvents,
      NonCollectionEventsHistory,
    ]),
  ],
  providers: [OcNonCollectionEventsChangeAuditService, JwtService],
  controllers: [OcNonCollectionEventsChangeAuditController],
  exports: [OcNonCollectionEventsChangeAuditService],
})
export class OcNonCollectionEventsChangeAuditModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '/oc-non-collection-events/:id/change-audit',
      method: RequestMethod.GET,
    });
  }
}
