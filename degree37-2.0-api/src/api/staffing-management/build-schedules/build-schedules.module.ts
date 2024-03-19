import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { BuildSchedulesController } from './controller/build-schedules.controller';
import { BuildSchedulesService } from './services/build-schedules.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedules.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { OperationsStatus } from 'src/api/system-configuration/tenants-administration/operations-administration/booking-drives/operation-status/entities/operations_status.entity';
import { BusinessUnits } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { ScheduleOperationStatus } from './entities/schedule-operation-status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Schedule,
      User,
      OperationsStatus,
      BusinessUnits,
      Permissions,
      ScheduleOperationStatus,
    ]),
  ],
  controllers: [BuildSchedulesController],
  providers: [BuildSchedulesService, JwtService],
})
export class BuildSchedulesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '/staffing-management/schedules',
      method: RequestMethod.POST,
    });
  }
}
