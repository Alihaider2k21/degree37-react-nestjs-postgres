import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { PerformanceRules } from './entities/performance-rules.entity';
import { PerformanceRulesHistory } from './entities/performance-rules-history.entity';
import { PerformanceRulesService } from './services/performance-rules.service';
import { PerformanceRulesController } from './controller/performance-rules.controller';
import { JwtService } from '@nestjs/jwt';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      PerformanceRules,
      PerformanceRulesHistory,
      Tenant,
      Permissions,
    ]),
  ],
  controllers: [PerformanceRulesController],
  providers: [PerformanceRulesService, JwtService],
  exports: [PerformanceRulesService],
})
export class PerformanceRulesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/goals_performance_rules', method: RequestMethod.POST },
        { path: '/goals_performance_rules', method: RequestMethod.GET },
        { path: '/goals_performance_rules/:id', method: RequestMethod.GET },
        { path: '/goals_performance_rules/:id', method: RequestMethod.PUT }
      );
  }
}
