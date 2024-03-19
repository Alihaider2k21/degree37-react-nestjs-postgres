import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { MonthlyGoals } from './entities/monthly-goals.entity';
import { MonthlyGoalsHistory } from './entities/monthly-goals-history.entity';
import { ProcedureTypes } from '../../products-procedures/procedure-types/entities/procedure-types.entity';
import { MonthlyGoalsController } from './controller/monthly-goals.controller';
import { MonthlyGoalsService } from './services/monthly-goals.service';
import { Facility } from '../../resources/facilities/entity/facility.entity';
import { BusinessUnits } from '../../hierarchy/business-units/entities/business-units.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { DailyGoalsAllocations } from '../daily-goals-allocation/entities/daily-goals-allocation.entity';
import { DailyGoalsCalenders } from '../daily-goals-calender/entity/daily-goals-calender.entity';
import { DailyGoalsCalenderModule } from '../daily-goals-calender/daily-goals-calender.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MonthlyGoals,
      User,
      ProcedureTypes,
      MonthlyGoalsHistory,
      Facility,
      BusinessUnits,
      Tenant,
      Permissions,
      DailyGoalsAllocations,
      DailyGoalsCalenders,
    ]),
    DailyGoalsCalenderModule,
  ],
  controllers: [MonthlyGoalsController],
  providers: [MonthlyGoalsService, JwtService],
  exports: [MonthlyGoalsService],
})
export class MonthlyGoalsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/monthly_goals', method: RequestMethod.POST },
        { path: '/monthly_goals', method: RequestMethod.GET },
        { path: '/monthly_goals/donors_recruiters', method: RequestMethod.GET },
        { path: '/monthly_goals/:id', method: RequestMethod.GET },
        { path: '/monthly_goals/:id', method: RequestMethod.PATCH },
        { path: '/monthly_goals/:id', method: RequestMethod.PUT }
      );
  }
}
