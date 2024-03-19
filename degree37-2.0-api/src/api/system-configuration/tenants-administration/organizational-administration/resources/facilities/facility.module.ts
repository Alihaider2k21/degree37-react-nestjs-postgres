import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { FacilityService } from './services/facility.services';
import { FacilityController } from './controller/facility.controller';
import { Facility } from './entity/facility.entity';
import { User } from '../../../user-administration/user/entity/user.entity';
import { FacilityHistory } from './entity/facilityHistory.entity';
import { BusinessUnits } from '../../hierarchy/business-units/entities/business-units.entity';
import { DonorCenterFilter } from './entity/donor_center.entity';
import { OrganizationalLevels } from '../../hierarchy/organizational-levels/entities/organizational-level.entity';
import { IndustryCategories } from '../../../crm-administration/account/industry-categories/entities/industry-categories.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Address } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/address.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { CustomFields } from '../../custom-fields/entities/custom-field.entity';
import { Drives } from 'src/api/operations-center/operations/drives/entities/drives.entity';
import { Sessions } from 'src/api/operations-center/operations/sessions/entities/sessions.entity';
import { DonorCenterBluePrints } from './donor-center-blueprints/entity/donor_center_blueprint';
import { ShiftsModule } from 'src/api/shifts/shifts.module';
import { Shifts } from 'src/api/shifts/entities/shifts.entity';
import { DailyCapacity } from '../../../operations-administration/booking-drives/daily-capacity/entities/daily-capacity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Facility,
      User,
      FacilityHistory,
      BusinessUnits,
      OrganizationalLevels,
      DonorCenterFilter,
      IndustryCategories,
      Address,
      Permissions,
      CustomFields,
      Shifts,
      Drives,
      Sessions,
      DonorCenterBluePrints,
      DailyCapacity,
    ]),
    ShiftsModule,
  ],
  providers: [FacilityService, JwtService],
  controllers: [FacilityController],
  exports: [FacilityService],
})
export class FacilityModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/system-configuration/facilities/:id',
        method: RequestMethod.PUT,
      },
      {
        path: '/system-configuration/facilities/donor-centers/filters',
        method: RequestMethod.POST,
      },
      {
        path: '/system-configuration/facilities/donor-centers/filters',
        method: RequestMethod.GET,
      },
      {
        path: '/system-configuration/facilities/donor-centers/filters/:id',
        method: RequestMethod.DELETE,
      },
      {
        path: '/system-configuration/facilities/donor-centers/archive/:id',
        method: RequestMethod.PATCH,
      },
      {
        path: '/system-configuration/facilities/donor-centers/search',
        method: RequestMethod.POST,
      },
      { path: '/system-configuration/facilities', method: RequestMethod.GET },
      { path: '/system-configuration/facilities', method: RequestMethod.POST },
      {
        path: '/system-configuration/facilities/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/system-configuration/facilities/:id/sessions-histories/key-performance-indicators',
        method: RequestMethod.GET,
      },
      {
        path: '/system-configuration/facilities/:id/sessions-histories',
        method: RequestMethod.GET,
      },
      {
        path: '/system-configuration/facilities/:id/sessions-histories/:sessionId',
        method: RequestMethod.GET,
      },
      {
        path: '/system-configuration/facilities/collection_operation/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/system-configuration/facilities/donor-centers/city-sate',
        method: RequestMethod.GET,
      },
      {
        path: '/system-configuration/facilities/get/stagingsite-donorcenters',
        method: RequestMethod.GET,
      }
    );
  }
}
