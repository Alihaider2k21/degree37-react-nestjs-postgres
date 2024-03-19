import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CalendersService } from './service/calender.service';
import { CalendersController } from './controller/calender.controller';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { JwtService } from '@nestjs/jwt';
import { OperationsStatus } from 'src/api/system-configuration/tenants-administration/operations-administration/booking-drives/operation-status/entities/operations_status.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { Shifts } from 'src/api/shifts/entities/shifts.entity';
import { Vehicle } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/vehicles/entities/vehicle.entity';
import { OrganizationalLevels } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/organizational-levels/entities/organizational-level.entity';
import { Procedure } from 'src/api/system-configuration/tenants-administration/organizational-administration/products-procedures/procedures/entities/procedure.entity';
import { NonCollectionEvents } from '../operations/non-collection-events/entities/oc-non-collection-events.entity';
import { Device } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/device/entities/device.entity';
import { Products } from 'src/api/system-configuration/tenants-administration/organizational-administration/products-procedures/products/entities/products.entity';
import { Staff } from 'src/api/crm/contacts/staff/entities/staff.entity';
import { Tasks } from 'src/api/tasks/entities/tasks.entity';
import { Sessions } from '../operations/sessions/entities/sessions.entity';
import { Favorites } from '../manage-favorites/entities/favorites.entity';
import { ProcedureTypes } from 'src/api/system-configuration/tenants-administration/organizational-administration/products-procedures/procedure-types/entities/procedure-types.entity';
import { Drives } from '../operations/drives/entities/drives.entity';
import { StaffShiftSchedule } from 'src/api/crm/contacts/staff/staffShiftSchedule/entity/staff-shift-schedule.entity';
import { ShiftsDevices } from 'src/api/shifts/entities/shifts-devices.entity';
import { ShiftsVehicles } from 'src/api/shifts/entities/shifts-vehicles.entity';
import { ShiftsProjectionsStaff } from 'src/api/shifts/entities/shifts-projections-staff.entity';
import { BusinessUnits } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { DailyGoalsCalenders } from 'src/api/system-configuration/tenants-administration/organizational-administration/goals/daily-goals-calender/entity/daily-goals-calender.entity';
import { ProcedureTypesProducts } from 'src/api/system-configuration/tenants-administration/organizational-administration/products-procedures/procedure-types/entities/procedure-types-products.entity';
import { DonorDonations } from 'src/api/crm/contacts/donor/donorDonationHistory/entities/donor-donations.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Permissions,
      OperationsStatus,
      Tenant,
      Shifts,
      Vehicle,
      OrganizationalLevels,
      NonCollectionEvents,
      Device,
      Vehicle,
      Products,
      Staff,
      Tasks,
      Sessions,
      Procedure,
      Favorites,
      ProcedureTypes,
      Drives,
      StaffShiftSchedule,
      ShiftsDevices,
      ShiftsVehicles,
      ShiftsProjectionsStaff,
      BusinessUnits,
      DailyGoalsCalenders,
      ProcedureTypesProducts,
      DonorDonations,
    ]),
  ],
  controllers: [CalendersController],
  providers: [CalendersService, JwtService],
})
export class CalendersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/operations-center/calender/monthly-view',
        method: RequestMethod.GET,
      },
      {
        path: '/operations-center/calender/procedure-type-products/:id',
        method: RequestMethod.GET,
      }
    );
  }
}
