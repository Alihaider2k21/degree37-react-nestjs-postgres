import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffSchedulesService } from './services/staff-schedules.service';
import { StaffSchedulesController } from './staff-schedule/controller/staff-schedules.controller';
import { AuthMiddleware } from '../middlewares/auth';
import { CommonFunction } from '../crm/contacts/common/common-functions';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { Contacts } from '../crm/contacts/common/entities/contacts.entity';
import { Address } from '../system-configuration/platform-administration/tenant-onboarding/tenant/entities/address.entity';
import { User } from '../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { JwtService } from '@nestjs/jwt';
import { StaffAssignments } from '../crm/contacts/staff/staffSchedule/entity/self-assignment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Address,
      Contacts,
      User,
      Permissions,
      StaffAssignments,
    ]),
  ],
  controllers: [StaffSchedulesController],
  providers: [StaffSchedulesService, CommonFunction, JwtService],
})
export class StaffingManagementModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/view-schedules/staff-schedules',
        method: RequestMethod.GET,
      },
      {
        path: '/view-schedules/staff-schedules/search',
        method: RequestMethod.POST,
      }
    );
  }
}
