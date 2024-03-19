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
import { OcNonCollectionEventsService } from './service/oc-non-collection-events.service';
import { JwtService } from '@nestjs/jwt';
import { OcNonCollectionEventsController } from './controller/oc-non-collection-events.controller';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { NonCollectionEvents } from './entities/oc-non-collection-events.entity';

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
    ]),
  ],
  providers: [OcNonCollectionEventsService, JwtService],
  controllers: [OcNonCollectionEventsController],
  exports: [OcNonCollectionEventsService],
})
export class OcNonCollectionEventsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: 'oc_non_collection_events/:id/get_all',
        method: RequestMethod.GET,
      },
      {
        path: 'oc_non_collection_events/status',
        method: RequestMethod.GET,
      }
    );
  }
}
