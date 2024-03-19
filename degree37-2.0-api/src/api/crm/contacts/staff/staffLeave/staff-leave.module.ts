import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { StaffLeaveService } from './service/staff-leave.service';
import { StaffLeaveController } from './controller/staff-leave.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { StaffLeave } from './entity/staff-leave.entity';
import { StaffLeaveHistory } from './entity/staff-leave-history.entity';
import { Staff } from 'src/api/crm/contacts/staff/entities/staff.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Staff,
      StaffLeave,
      StaffLeaveHistory,
      Permissions,
    ]),
  ],
  controllers: [StaffLeaveController],
  providers: [StaffLeaveService, JwtService],
})
export class StaffLeaveModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/staff-leave/create',
        method: RequestMethod.POST,
      },
      {
        path: '/staff-leave/list',
        method: RequestMethod.GET,
      },
      {
        path: '/staff-leave/:id/find',
        method: RequestMethod.GET,
      },
      {
        path: '/staff-leave/:id/archive',
        method: RequestMethod.PATCH,
      },
      {
        path: '/staff-leave/:id/edit',
        method: RequestMethod.PUT,
      }
    );
  }
}
