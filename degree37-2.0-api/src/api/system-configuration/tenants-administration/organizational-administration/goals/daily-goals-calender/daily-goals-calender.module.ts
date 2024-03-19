import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { ProcedureTypes } from '../../products-procedures/procedure-types/entities/procedure-types.entity';
import { OrganizationalLevels } from '../../hierarchy/organizational-levels/entities/organizational-level.entity';
import { DailyGoalsCalenders } from '../daily-goals-calender/entity/daily-goals-calender.entity';
import { DailyGoalsCalenderController } from './controller/daily-goals-calender.controller';
import { DailyGoalsCalenderService } from './service/daily-goals-calender.service';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { MonthlyGoals } from '../monthly-goals/entities/monthly-goals.entity';
import { DailyGoalsAllocations } from '../daily-goals-allocation/entities/daily-goals-allocation.entity';
import { DailyGoalsCalendersHistory } from './entity/daily-goals-calender-history.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      ProcedureTypes,
      DailyGoalsCalendersHistory,
      OrganizationalLevels,
      DailyGoalsCalenders,
      MonthlyGoals,
      DailyGoalsAllocations,
      Permissions,
    ]),
  ],
  controllers: [DailyGoalsCalenderController],
  providers: [DailyGoalsCalenderService, JwtService],
  exports: [DailyGoalsCalenderService],
})
export class DailyGoalsCalenderModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/daily-goals-calender', method: RequestMethod.GET },
      {
        path: '/daily-goals-calender/allocation',
        method: RequestMethod.POST,
      },
      { path: '/daily-goals-calender', method: RequestMethod.PUT }
    );
  }
}
