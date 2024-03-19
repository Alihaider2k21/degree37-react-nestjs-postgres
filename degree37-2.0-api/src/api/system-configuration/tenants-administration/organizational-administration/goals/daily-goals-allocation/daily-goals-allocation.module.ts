import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { DailyGoalsAllocationService } from './service/daily-goals-allocation.service';
import { DailyGoalsAllocationController } from './controller/daily-goals-allocation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { ProcedureTypes } from '../../products-procedures/procedure-types/entities/procedure-types.entity';
import { OrganizationalLevels } from '../../hierarchy/organizational-levels/entities/organizational-level.entity';
import { DailyGoalsAllocations } from './entities/daily-goals-allocation.entity';
import { DailyGoalsAllocationHistory } from './entities/daily-goals-allocation-history.entity';
import { DailyGoalsCalenders } from '../daily-goals-calender/entity/daily-goals-calender.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { BusinessUnits } from '../../hierarchy/business-units/entities/business-units.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { MonthlyGoals } from '../monthly-goals/entities/monthly-goals.entity';
import { DailyGoalsCalenderModule } from '../daily-goals-calender/daily-goals-calender.module';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      ProcedureTypes,
      BusinessUnits,
      DailyGoalsAllocations,
      DailyGoalsAllocationHistory,
      DailyGoalsCalenders,
      Tenant,
      MonthlyGoals,
      Permissions,
    ]),
    DailyGoalsCalenderModule,
  ],
  controllers: [DailyGoalsAllocationController],
  providers: [DailyGoalsAllocationService, JwtService],
})
export class DailyGoalsAllocationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/daily-goals-allocation', method: RequestMethod.POST },
      { path: '/daily-goals-allocation', method: RequestMethod.GET },
      { path: '/daily-goals-allocation/:id', method: RequestMethod.GET },
      { path: '/daily-goals-allocation/:id', method: RequestMethod.DELETE },
      { path: '/daily-goals-allocation/:id', method: RequestMethod.PUT },
      {
        path: '/daily-goals-allocation/archive/:id',
        method: RequestMethod.PUT,
      }
    );
  }
}
