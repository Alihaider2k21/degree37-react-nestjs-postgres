import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from 'src/api/crm/contacts/staff/entities/staff.entity';
import { StaffAssignments } from 'src/api/crm/contacts/staff/staffSchedule/entity/self-assignment.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { ShiftsProjectionsStaff } from 'src/api/shifts/entities/shifts-projections-staff.entity';
import { Shifts } from 'src/api/shifts/entities/shifts.entity';
import { ContactsRoles } from 'src/api/system-configuration/tenants-administration/crm-administration/contacts/role/entities/contacts-role.entity';
import { StaffConfig } from 'src/api/system-configuration/tenants-administration/staffing-administration/staff-setups/entity/StaffConfig.entity';
import { StaffingController } from './controller/staffing.controller';
import { StaffingService } from './service/staffing.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { Roles } from '../../../../system-configuration/platform-administration/roles-administration/role-permissions/entities/role.entity';
import { ShiftsRoles } from '../../../../crm/crm-non-collection-profiles/blueprints/entities/shifts-roles.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Shifts,
      ShiftsProjectionsStaff,
      StaffConfig,
      Roles,
      StaffAssignments,
      Staff,
      ShiftsRoles,
      User,
      Permissions,
    ]),
  ],
  controllers: [StaffingController],
  providers: [StaffingService, JwtService],
})
export class StaffingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/operations/drives/:id/staffing',
        method: RequestMethod.GET,
      },
      {
        path: '/operations/sessions/:id/staffing',
        method: RequestMethod.GET,
      },
      {
        path: '/operations/non_collection_events/:id/staffing',
        method: RequestMethod.GET,
      }
    );
  }
}
