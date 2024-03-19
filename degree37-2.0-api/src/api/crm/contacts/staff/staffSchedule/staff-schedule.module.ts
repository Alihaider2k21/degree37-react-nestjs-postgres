import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Staff } from 'src/api/crm/contacts/staff/entities/staff.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { StaffScheduleService } from './service/staff-schedule.service';
import { StaffScheduleController } from './controller/staff-schedule.controller';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { StaffAssignments } from './entity/self-assignment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Staff, Permissions, StaffAssignments]),
  ],
  controllers: [StaffScheduleController],
  providers: [StaffScheduleService, JwtService],
})
export class StaffScheduleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/staff-schedules/description-dropdown',
        method: RequestMethod.GET,
      },
      {
        path: '/staff-schedules/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/staff-schedules/:id',
        method: RequestMethod.PATCH,
      },
      {
        path: '/staff-schedules/view/:id',
        method: RequestMethod.GET,
      }
    );
  }
}
