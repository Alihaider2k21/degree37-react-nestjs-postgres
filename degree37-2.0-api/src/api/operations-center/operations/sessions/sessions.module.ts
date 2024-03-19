import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { Sessions } from './entities/sessions.entity';
import { SessionsHistory } from './entities/sessions-history.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { PromotionEntity } from 'src/api/system-configuration/tenants-administration/operations-administration/marketing-equipment/promotions/entity/promotions.entity';
import { OperationsStatus } from 'src/api/system-configuration/tenants-administration/operations-administration/booking-drives/operation-status/entities/operations_status.entity';
import { CustomFields } from 'src/api/system-configuration/tenants-administration/organizational-administration/custom-fields/entities/custom-field.entity';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { BusinessUnits } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { Facility } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/facilities/entity/facility.entity';
import { SessionsPromotions } from './entities/sessions-promotions.entity';
import { SessionsPromotionsHistory } from './entities/sessions-promotions-history.entity';
import { ShiftsService } from 'src/api/shifts/services/shifts.service';
import { Vehicle } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/vehicles/entities/vehicle.entity';
import { ProcedureTypesProducts } from 'src/api/system-configuration/tenants-administration/organizational-administration/products-procedures/procedure-types/entities/procedure-types-products.entity';
import { StaffSetup } from 'src/api/system-configuration/tenants-administration/staffing-administration/staff-setups/entity/staffSetup.entity';
import { Shifts } from 'src/api/shifts/entities/shifts.entity';
import { ShiftsStaffSetups } from 'src/api/shifts/entities/shifts-staffsetups.entity';
import { ShiftsDevices } from 'src/api/shifts/entities/shifts-devices.entity';
import { ShiftsHistory } from 'src/api/shifts/entities/shifts-history.entity';
import { Products } from 'src/api/system-configuration/tenants-administration/organizational-administration/products-procedures/products/entities/products.entity';
import { ShiftsProjectionsStaff } from 'src/api/shifts/entities/shifts-projections-staff.entity';
import { ShiftsProjectionsStaffHistory } from 'src/api/shifts/entities/shifts-projections-staff-history.entity';
import { ShiftsSlots } from 'src/api/shifts/entities/shifts-slots.entity';
import { ShiftsVehicles } from 'src/api/shifts/entities/shifts-vehicles.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Sessions,
      SessionsHistory,
      SessionsPromotions,
      SessionsPromotionsHistory,
      User,
      PromotionEntity,
      OperationsStatus,
      CustomFields,
      Permissions,
      BusinessUnits,
      Facility,
      Vehicle,
      Products,
      ProcedureTypesProducts,
      Shifts,
      ShiftsHistory,
      ShiftsProjectionsStaff,
      ShiftsProjectionsStaffHistory,
      ShiftsStaffSetups,
      ShiftsSlots,
      ShiftsDevices,
      ShiftsVehicles,
      StaffSetup,
    ]),
  ],
  controllers: [SessionsController],
  providers: [SessionsService, ShiftsService, JwtService],
})
export class SessionsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/operations/sessions/create', method: RequestMethod.POST },
      { path: '/operations/sessions/list', method: RequestMethod.GET },
      { path: '/operations/sessions/:id/find', method: RequestMethod.GET },
      { path: '/operations/sessions/:id/update', method: RequestMethod.PUT },
      {
        path: '/operations/sessions/:id/delete',
        method: RequestMethod.DELETE,
      }
    );
  }
}
