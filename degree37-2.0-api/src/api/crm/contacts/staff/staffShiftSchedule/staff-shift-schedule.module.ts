import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { StaffShiftScheduleController } from './controller/staff-shift-schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Staff } from 'src/api/crm/contacts/staff/entities/staff.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { StaffShiftScheduleService } from './service/staff-shift-schedule.service';
import { StaffShiftSchedule } from './entity/staff-shift-schedule.entity';
import { StaffShiftScheduleHistory } from './entity/staff-shift-schedule-history';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Staff,
      Permissions,
      StaffShiftSchedule,
      StaffShiftScheduleHistory,
    ]),
  ],
  controllers: [StaffShiftScheduleController],
  providers: [StaffShiftScheduleService, JwtService],
})
export class StaffShiftScheduleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/staffs/shift-schedule/:id',
        method: RequestMethod.POST,
      },
      {
        path: '/staffs/shift-schedule/:id',
        method: RequestMethod.GET,
      }
    );
  }
}
