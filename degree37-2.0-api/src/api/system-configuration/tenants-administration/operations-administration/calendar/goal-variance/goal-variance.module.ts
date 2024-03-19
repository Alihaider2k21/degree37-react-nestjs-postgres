import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { GoalVariance } from './entities/goal-variance.entity';
import { GoalVarianceHistory } from './entities/goal-variance-history.entity';
import { GoalVarianceController } from './controller/goal-variance.controller';
import { GoalVarianceService } from './services/goal-variance.service';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GoalVariance,
      GoalVarianceHistory,
      User,
      Tenant,
      Permissions,
    ]),
  ],
  controllers: [GoalVarianceController],
  providers: [GoalVarianceService, JwtService],
  exports: [GoalVarianceService],
})
export class GoalVarianceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/goal_variance', method: RequestMethod.POST },
        { path: '/goal_variance', method: RequestMethod.GET },
        { path: '/goal_variance', method: RequestMethod.PUT }
      );
  }
}
