import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ResourceSharingService } from './service/resource-sharing.service';
import { ResourceSharingController } from './controller/resource-sharing.controller';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { ResourceSharings } from './entities/resource-sharing.entity';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { BusinessUnitsService } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/services/business-units.service';
import { BusinessUnits } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { OrganizationalLevels } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/organizational-levels/entities/organizational-level.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { BusinessUnitsHistory } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units-history.entity';
import { ResourceSharingsHistory } from './entities/resource-sharing-history.entity';
import { Vehicle } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/vehicles/entities/vehicle.entity';
import { Device } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/device/entities/device.entity';
import { Staff } from 'src/api/crm/contacts/staff/entities/staff.entity';
import { ResourceSharingsFulfillment } from './entities/resource-sharing-fullfilment.entity';
import { ResourceSharingsFulfillmentHistory } from './entities/resource-sharing-fullfilment-history.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResourceSharings,
      Permissions,
      User,
      BusinessUnitsService,
      BusinessUnits,
      OrganizationalLevels,
      Tenant,
      BusinessUnitsHistory,
      ResourceSharingsHistory,
      Vehicle,
      Device,
      Staff,
      ResourceSharingsFulfillment,
      ResourceSharingsFulfillmentHistory,
    ]),
  ],
  controllers: [ResourceSharingController],
  providers: [ResourceSharingService, JwtService, BusinessUnitsService],
  exports: [ResourceSharingService, BusinessUnitsService],
})
export class ResourceSharingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: 'operations-center/resource-sharing',
        method: RequestMethod.POST,
      },
      {
        path: 'operations-center/resource-sharing',
        method: RequestMethod.GET,
      },
      {
        path: 'operations-center/resource-sharing/collection_operations/list',
        method: RequestMethod.GET,
      },
      {
        path: 'operations-center/resource-sharing/:id',
        method: RequestMethod.PUT,
      },
      {
        path: 'operations-center/resource-sharing/:id',
        method: RequestMethod.GET,
      },
      {
        path: 'operations-center/resource-sharing/:id',
        method: RequestMethod.PATCH,
      },
      {
        path: 'operations-center/resource-sharing/:id/fulfill-request',
        method: RequestMethod.POST,
      },
      {
        path: 'operations-center/resource-sharing/:id/fulfill-request',
        method: RequestMethod.PATCH,
      },
      {
        path: 'operations-center/resource-sharing/:id/fulfill-request',
        method: RequestMethod.GET,
      }
    );
  }
}
