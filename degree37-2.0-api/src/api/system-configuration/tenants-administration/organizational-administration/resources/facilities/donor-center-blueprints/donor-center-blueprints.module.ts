import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { DonorCenterBlueprintService } from './services/donor-center-blueprints.services';
import { DonorCenterBlueprintController } from './controller/donor-center-blueprints.controller';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { DonorCenterBluePrints } from './entity/donor_center_blueprint';
import { ShiftsModule } from 'src/api/shifts/shifts.module';
import { Shifts } from 'src/api/shifts/entities/shifts.entity';
import { Facility } from '../entity/facility.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { ShiftsSlots } from 'src/api/shifts/entities/shifts-slots.entity';
import { ShiftsService } from 'src/api/shifts/services/shifts.service';
import { ShiftsSlotsHistory } from 'src/api/shifts/entities/shifts-slots-history.entity';
import { ShiftsProjectionsStaff } from 'src/api/shifts/entities/shifts-projections-staff.entity';
import { DonorCenterBluePrintsHistory } from './entity/donor_center_blueprint_history';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DonorCenterBluePrints,
      Shifts,
      Facility,
      User,
      Permissions,
      ShiftsSlots,
      ShiftsSlotsHistory,
      ShiftsProjectionsStaff,
      DonorCenterBluePrintsHistory,
    ]),
    ShiftsModule,
  ],
  providers: [DonorCenterBlueprintService, JwtService],
  controllers: [DonorCenterBlueprintController],
  exports: [DonorCenterBlueprintService],
})
export class DonorCenterBlueprintsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/facility/donor-center/bluePrints/:id/get',
        method: RequestMethod.GET,
      },
      {
        path: '/facility/donor-center/bluePrints/:id/get/default',
        method: RequestMethod.GET,
      },
      {
        path: '/facility/donor-center/bluePrints/create',
        method: RequestMethod.POST,
      },
      {
        path: '/facility/donor-center/bluePrints/details/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/facility/donor-center/bluePrints/shift-details/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/facility/donor-center/bluePrints/shifts/:shiftId/projection/:procedureTypeId/slots',
        method: RequestMethod.POST,
      },
      {
        path: '/facility/donor-center/bluePrints/shifts/slots/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/facility/donor-center/bluePrints/shifts/projection/staff',
        method: RequestMethod.PATCH,
      },
      {
        path: '/facility/donor-center/bluePrints/:id',
        method: RequestMethod.DELETE,
      },
      {
        path: '/facility/donor-center/bluePrints/bluePrints/shifts/procedure-type/slots',
        method: RequestMethod.POST,
      },
      {
        path: '/facility/donor-center/bluePrints/bluePrints/shifts/procedure-type/projection-staff',
        method: RequestMethod.POST,
      },
      {
        path: '/facility/donor-center/bluePrints/edit/:id',
        method: RequestMethod.POST,
      },
      {
        path: '/facility/donor-centers/makeDefault/:id',
        method: RequestMethod.POST,
      },
      {
        path: '/facility/donor-center/duplicate/:id',
        method: RequestMethod.POST,
      }
    );
  }
}
