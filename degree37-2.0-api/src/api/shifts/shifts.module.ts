import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { User } from '../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { AuthMiddleware } from '../middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Tenant } from '../system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { Shifts } from './entities/shifts.entity';
import { ShiftsHistory } from './entities/shifts-history.entity';
import { ShiftsService } from './services/shifts.service';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { ShiftsDevices } from './entities/shifts-devices.entity';
import { ShiftsSlots } from './entities/shifts-slots.entity';
import { ShiftsVehicles } from './entities/shifts-vehicles.entity';
import { ShiftsStaffSetups } from './entities/shifts-staffsetups.entity';
import { ShiftsProjectionsStaff } from './entities/shifts-projections-staff.entity';
import { ShiftsProjectionsStaffHistory } from './entities/shifts-projections-staff-history.entity';
import { StaffSetup } from '../system-configuration/tenants-administration/staffing-administration/staff-setups/entity/staffSetup.entity';
import { Vehicle } from '../system-configuration/tenants-administration/organizational-administration/resources/vehicles/entities/vehicle.entity';
import { Products } from '../system-configuration/tenants-administration/organizational-administration/products-procedures/products/entities/products.entity';
import { ProcedureTypesProducts } from '../system-configuration/tenants-administration/organizational-administration/products-procedures/procedure-types/entities/procedure-types-products.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Shifts,
      Tenant,
      Products,
      ProcedureTypesProducts,
      ShiftsDevices,
      ShiftsSlots,
      ShiftsVehicles,
      Vehicle,
      StaffSetup,
      ShiftsStaffSetups,
      ShiftsHistory,
      ShiftsProjectionsStaff,
      ShiftsProjectionsStaffHistory,
      Permissions,
    ]),
  ],
  providers: [ShiftsService, JwtService],
  controllers: [],
  exports: [ShiftsService],
})
export class ShiftsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/shifts', method: RequestMethod.POST });
  }
}
