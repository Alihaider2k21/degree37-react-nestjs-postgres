import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ActivityLogService } from '././services/recent-activity.service';
import { ActivityLogController } from './controllers/recent-activity.controller';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonorsActivities } from './entities/recent-activity.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({})
@Module({
  imports: [TypeOrmModule.forFeature([DonorsActivities, User, Permissions])],
  controllers: [ActivityLogController],
  providers: [ActivityLogService, JwtService],
  exports: [ActivityLogService],
})
export class DonorRecentActivity implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/donors/activities',
        method: RequestMethod.POST,
      },
      {
        path: '/donors/activities',
        method: RequestMethod.GET,
      }
    );
  }
}
