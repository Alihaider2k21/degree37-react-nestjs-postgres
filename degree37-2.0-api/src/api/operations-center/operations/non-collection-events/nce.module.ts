import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { Accounts } from 'src/api/crm/accounts/entities/accounts.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { PromotionEntity } from 'src/api/system-configuration/tenants-administration/operations-administration/marketing-equipment/promotions/entity/promotions.entity';
import { OperationsStatus } from 'src/api/system-configuration/tenants-administration/operations-administration/booking-drives/operation-status/entities/operations_status.entity';
import { CrmLocations } from 'src/api/crm/locations/entities/crm-locations.entity';
import { AccountContacts } from 'src/api/crm/accounts/entities/accounts-contacts.entity';
import { ContactsRoles } from 'src/api/system-configuration/tenants-administration/crm-administration/contacts/role/entities/contacts-role.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { ShiftsModule } from 'src/api/shifts/shifts.module';
import { CustomFields } from 'src/api/system-configuration/tenants-administration/organizational-administration/custom-fields/entities/custom-field.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { NCEController } from './controller/nce.controller';
import { NCEService } from './service/nce.service';
import { Shifts } from 'src/api/shifts/entities/shifts.entity';
import { ShiftsDevices } from 'src/api/shifts/entities/shifts-devices.entity';
import { ShiftsVehicles } from 'src/api/shifts/entities/shifts-vehicles.entity';
import { ShiftsHistory } from 'src/api/shifts/entities/shifts-history.entity';
import { Device } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/device/entities/device.entity';
import { Vehicle } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/vehicles/entities/vehicle.entity';
import { EntityManager } from 'typeorm';
import { CrmNonCollectionProfiles } from 'src/api/crm/crm-non-collection-profiles/entities/crm-non-collection-profiles.entity';
import { NonCollectionEvents } from './entities/oc-non-collection-events.entity';
import { NonCollectionEventsHistory } from './entities/oc-non-collection-events-history.entity';
import { BusinessUnits } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { ShiftsRoles } from 'src/api/crm/crm-non-collection-profiles/blueprints/entities/shifts-roles.entity';
import { Category } from 'src/api/system-configuration/tenants-administration/crm-administration/common/entity/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Accounts,
      User,
      CrmLocations,
      PromotionEntity,
      OperationsStatus,
      AccountContacts,
      Tenant,
      CustomFields,
      Permissions,
      Shifts,
      ShiftsDevices,
      ShiftsVehicles,
      ShiftsHistory,
      Device,
      Vehicle,
      ContactsRoles,
      EntityManager,
      CrmNonCollectionProfiles,
      NonCollectionEvents,
      NonCollectionEventsHistory,
      BusinessUnits,
      OperationsStatus,
      ShiftsRoles,
      Category,
    ]),
    ShiftsModule,
  ],
  controllers: [NCEController],
  providers: [NCEService, JwtService],
})
export class NCEModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/operations/non-collection-events',
        method: RequestMethod.POST,
      },
      {
        path: '/operations/non-collection-events',
        method: RequestMethod.GET,
      },
      {
        path: '/operations/non-collection-events/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/operations/non-collection-events/:id/shift-details',
        method: RequestMethod.GET,
      },
      {
        path: '/operations/non-collection-events/:id',
        method: RequestMethod.PUT,
      },
      {
        path: '/operations/non-collection-events/archive/:id',
        method: RequestMethod.PATCH,
      },
      {
        path: '/operations/non-collection-events/with-directions/:collectionOperationId',
        method: RequestMethod.GET,
      },
      {
        path: '/operations/non-collection-events/location-events/:locationId',
        method: RequestMethod.GET,
      }
    );
  }
}
