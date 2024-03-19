import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { StaffSetupService } from './services/staffSetup.service';
import { StaffSetupController } from './controller/staffSetup.controller';
/* staff setup */
import { StaffSetup } from './entity/staffSetup.entity';
import { StaffSetupHistory } from './entity/staffSetupHistory.entity';
import { StaffConfigHistory } from './entity/StaffConfigHistory.entity';
import { StaffConfig } from './entity/StaffConfig.entity';
/* others */
import { User } from '../../user-administration/user/entity/user.entity';
import { ProcedureTypes } from '../../organizational-administration/products-procedures/procedure-types/entities/procedure-types.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { ContactsRoles } from '../../crm-administration/contacts/role/entities/contacts-role.entity';
import { DailyCapacity } from '../../operations-administration/booking-drives/daily-capacity/entities/daily-capacity.entity';
import { Drives } from 'src/api/operations-center/operations/drives/entities/drives.entity';
import { Shifts } from 'src/api/shifts/entities/shifts.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StaffSetup,
      StaffSetupHistory,
      StaffConfig,
      StaffConfigHistory,
      User,
      ContactsRoles,
      ProcedureTypes,
      Permissions,
      DailyCapacity,
      Drives,
      Shifts,
    ]),
  ],
  providers: [StaffSetupService, JwtService],
  controllers: [StaffSetupController],
  exports: [StaffSetupService],
})
export class StaffSetupModule /*  {} */ implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/staffing-admin/staff-setup',
        method: RequestMethod.POST,
      },
      {
        path: '/staffing-admin/staff-setup',
        method: RequestMethod.GET,
      },
      {
        path: '/staffing-admin/staff-setup/drive',
        method: RequestMethod.GET,
      },
      {
        path: '/staffing-admin/staff-setup/blueprint/donor_center',
        method: RequestMethod.GET,
      },
      {
        path: '/staffing-admin/staff-setup/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/staffing-admin/staff-setup/drives/byIds',
        method: RequestMethod.GET,
      },
      {
        path: '/staffing-admin/staff-setup/:id',
        method: RequestMethod.PATCH,
      },
      {
        path: '/staffing-admin/staff-setup/edit/:id',
        method: RequestMethod.PUT,
      }
    );
  }
}
